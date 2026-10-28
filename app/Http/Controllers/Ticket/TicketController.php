<?php

namespace App\Http\Controllers\Ticket;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Http\Controllers\Controller;
use Box\Spout\Writer\Common\Creator\WriterEntityFactory;
use Box\Spout\Common\Entity\Style\Color;
use Carbon\Carbon;




class TicketController extends Controller
{
    /**
     * Halaman Open Ticket
     */
    public function open()
    {
        $user = auth()->user();

        return Inertia::render("Ticket/Open", [
            "gateway" => $user->gateway ? [
                "id"    => $user->gateway->id,
                "code"  => $user->gateway->code,
                "name"  => $user->gateway->name,
            ] : null,

            "categories" => \App\Models\Category::with("subcategories")
                ->orderBy("name")
                ->get()
                ->map(fn($c) => [
                    "id"   => $c->id,
                    "name" => $c->name,
                    "type" => $c->type,
                    "subcategories" => $c->subcategories
                        ->map(fn($s) => [
                            "id"   => $s->id,
                            "name" => $s->name,
                        ]),
                ]),
        ]);
    }

    /**
     * Detail Ticket
     */

    public function show($ticket_number)
    {
        $ticket = Ticket::with(['gateway', 'user', 'updates', 'categoryRef', 'subCategoryRef'])
            ->where('ticket_number', $ticket_number)
            ->firstOrFail();

        // =============================
        // UPDATE HISTORY
        // =============================
        $updates = $ticket->updates()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn($u) => [
                "date"        => $u->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i'),
                "updated_by"  => $u->updated_by,
                "flag"        => $u->flag,
                "indication"  => $u->indication,
                "action"      => $u->action,
                "description" => $u->description,
            ]);

        // Ambil update terakhir untuk end_date & durasi
        $lastUpdate = $ticket->updates()->latest()->first();

        // =============================
        // HITUNG DURATION (TANPA end_date)
        // =============================
        $duration = "-";

        if ($ticket->status === 'closed' && $lastUpdate) {

            // start_date dianggap WIB
            $start = Carbon::createFromFormat(
                'Y-m-d H:i:s',
                $ticket->start_date,
                'Asia/Jakarta'
            );

            // created_at dianggap UTC (default MariaDB)
            $end = Carbon::createFromFormat(
                'Y-m-d H:i:s',
                $lastUpdate->created_at,
                'UTC'
            )->setTimezone('Asia/Jakarta');

            $totalMinutes = $start->diffInMinutes($end);

            $days    = intdiv($totalMinutes, 1440); // 24*60
            $hours   = intdiv($totalMinutes % 1440, 60);
            $minutes = $totalMinutes % 60;

            if ($days > 0) {
                $duration = "{$days} Hari {$hours} Jam {$minutes} Menit";
            } elseif ($hours > 0) {
                $duration = "{$hours} Jam {$minutes} Menit";
            } else {
                $duration = "{$minutes} Menit";
            }
        }

        return Inertia::render('Ticket/ViewTicket', [
            "ticket" => [
                'ticket_number' => $ticket->ticket_number,
                'gateway'       => $ticket->gateway->name ?? '-',
                'ticket_date'   => $ticket->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i'),
                'start_date'    => $ticket->start_date,
                'category'      => $ticket->categoryRef->name ?? '-',
                'subcategory'   => $ticket->subCategoryRef->name ?? '-',
                'serial_number' => $ticket->serial_number,
                'flag'          => strtoupper($ticket->flag),
                'alarm'         => $ticket->alarm,
                'indication'    => $ticket->indication,
                'action'        => $ticket->action,
                'description'   => $ticket->description,
                'updated_by'    => $ticket->user->name ?? '-',
                'pic'           => $ticket->gateway->name ?? '-',
                'status'        => ucfirst($ticket->status),

                // DURATION FIXED
                'duration'      => $duration,

                'assigned_date' => $ticket->start_date,

                // END DATE FIXED
                'end_date'      => ($ticket->status === 'closed' && $lastUpdate)
                    ? $lastUpdate->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i')
                    : "-",
            ],
            "updates" => $updates
        ]);
    }


    /**
     * Store ticket
     */
    public function store(Request $request)
    {
        $request->validate([
            'gateway_id'        => 'required',
            'start_date'        => 'required|date',
            'category_id'       => 'required|integer|exists:categories,id',
            'sub_category_id'   => 'nullable|integer|exists:sub_categories,id',
            'serial_number'     => 'nullable|string',
            'flag'              => 'required|string',
            'alarm'             => 'nullable|string',
            'indication'        => 'nullable|string',
            'action'            => 'nullable|string',
            'description'       => 'nullable|string',
        ]);

        $category     = \App\Models\Category::find($request->category_id);
        $subcategory  = $request->sub_category_id
            ? \App\Models\SubCategory::find($request->sub_category_id)
            : null;

        $gateway      = \App\Models\Gateway::find($request->gateway_id);
        $gatewayCode  = $gateway->code ?? 'GW';

        $running      = str_pad(Ticket::count() + 1, 5, '0', STR_PAD_LEFT);
        $ticketNumber = "TID-{$gatewayCode}-" . date('Y-m') . "-{$running}";

        Ticket::create([
            'ticket_number'     => $ticketNumber,
            'user_id'           => auth()->id(),
            'gateway_id'        => $request->gateway_id,
            'start_date'        => $request->start_date,

            'category_id'       => $request->category_id,
            'sub_category_id'   => $request->sub_category_id,

            'category'          => $category?->name,
            'sub_category'      => $subcategory?->name,
            'old_category'      => $category?->name,
            'old_subcategory'   => $subcategory?->name,

            'serial_number'     => $request->serial_number,
            'flag'              => $request->flag,
            'alarm'             => $request->alarm,
            'indication'        => $request->indication,
            'action'            => $request->action,
            'description'       => $request->description,
            'status'            => 'open',
        ]);

        return redirect()
            ->route('ticket.list')
            ->with('success', 'Ticket berhasil dibuat!');
    }

    /**
     * List Ticket
     */
    public function list(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $status  = $request->get('status', null);

        $query = Ticket::with(['gateway', 'user', 'categoryRef', 'subCategoryRef'])
            ->orderBy('created_at', 'desc');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $tickets = $query->paginate($perPage)->withQueryString();
        $tickets->getCollection()->transform(function ($t) {

            // Ambil last update PER ticket
            $lastUpdate = $t->updates()->latest()->first();

            return [
                'ticket_number' => $t->ticket_number,
                'gateway'       => $t->gateway->name ?? '-',
                'ticket_date'   => $t->created_at->format('Y-m-d H:i'),
                'start_date'    => $t->start_date,

                'category'      => $t->categoryRef->name ?? '-',
                'subcategory'   => $t->subCategoryRef->name ?? '-',
                'serial_number' => $t->serial_number,

                'flag'          => strtoupper($t->flag),
                'alarm'         => $t->alarm,
                'indication'    => $t->indication,
                'updated_by'    => $t->user->name ?? '-',

                'pic'           => ($t->gateway->code ?? '') . ' - ' . ($t->gateway->name ?? '-'),
                'status'        => ucfirst($t->status),

                'duration'      => "-",
                'assigned_by'   => $t->user->name ?? '-',
                'assigned_date' => $t->start_date,

                // END DATE dari last update
                'end_date' => $lastUpdate
                    ? $lastUpdate->created_at->timezone('Asia/Jakarta')->format('Y-m-d H:i')
                    : "-",
            ];
        });

        return inertia("Ticket/List", [
            "tickets" => $tickets,
        ]);
    }

    /**
     * Edit ticket
     */
    public function edit($ticket_number)
    {
        $ticket = Ticket::with(['categoryRef', 'subCategoryRef', 'gateway'])
            ->where('ticket_number', $ticket_number)
            ->firstOrFail();

        return Inertia::render('Ticket/UpdateTicket', [
            "ticket" => [
                "ticket_number" => $ticket->ticket_number,
                "gateway"       => $ticket->gateway->code . " " . $ticket->gateway->name,
                "ticket_date"   => $ticket->created_at,
                "start_date"    => $ticket->start_date,
                "category"      => $ticket->categoryRef->name ?? "-",
                "subcategory"   => $ticket->subCategoryRef->name ?? "-",
                "serial_number" => $ticket->serial_number,
                "flag"          => $ticket->flag,
                "alarm"         => $ticket->alarm,
                "indication"    => $ticket->indication,
                "description"   => $ticket->description,
                "updated_by"    => auth()->user()->name,
                "pic"           => auth()->user()->Department->name ?? "-",
                "status"        => $ticket->status,
            ]
        ]);
    }

    /**
     * Update history
     */
    public function update(Request $request, $ticket_number)
    {
        $ticket = Ticket::where('ticket_number', $ticket_number)->firstOrFail();

        $request->validate([
            'flag'        => 'required|string',
            'indication'  => 'required|string',
            'action'      => 'required|string',
            'description' => 'nullable|string',
            'status'      => 'required|string',
            'end_date'    => 'nullable|date',
        ]);

        // 🔥 Simpan ke log update (ticket_updates)
        $ticket->updates()->create([
            'updated_by'  => auth()->user()->name,
            'flag'        => $request->flag,
            'indication'  => $request->indication,
            'action'      => $request->action,
            'description' => $request->description,
        ]);

        // 🔥 Proses perubahan status
        $newStatus = strtolower($request->status);

        // if ($ticket->status === 'closed') {
        //     abort(403, 'Ticket sudah ditutup');
        // }

        // Jika ticket di-close
        if ($newStatus === 'close' || $newStatus === 'closed') {
            $ticket->update([
                'status'   => 'closed',
                'end_date' => $request->end_date
                    ? Carbon::parse($request->end_date)->timezone('Asia/Jakarta')
                    : now('Asia/Jakarta'),
            ]);
        }
        // Jika hanya update biasa
        else if ($newStatus === 'assign') {
            $ticket->update([
                'status' => 'assign',
            ]);
        } else {
            $ticket->update([
                'status' => 'update',
            ]);
        }

        return redirect()
            ->route('ticket.view', $ticket_number)
            ->with('success', 'Ticket berhasil diupdate!');
    }

    /**
     * Download CSV Report
     */


    public function close(Request $request, $ticket_number)
    {
        $ticket = Ticket::where('ticket_number', $ticket_number)->firstOrFail();

        $request->validate([
            'end_date' => 'required|date',
        ]);

        $ticket->update([
            'status' => 'closed',
            'end_date' => $request->end_date,
        ]);

        return redirect()
            ->route('ticket.view', $ticket_number)
            ->with('success', 'Ticket berhasil ditutup.');
    }

    public function destroy($ticket_number)
    {
        $ticket = Ticket::where('ticket_number', $ticket_number)->first();

        if (!$ticket) {
            return back(); // jangan with error
        }

        $ticket->delete();

        return redirect()->back(); // jangan with success
    }
    public function report()
    {
        $categories = \App\Models\Category::with('subcategories')
            ->orderBy('name')
            ->get()
            ->map(fn($c) => [
                "id" => $c->id,
                "name" => $c->name,
                "subcategories" => $c->subcategories->map(fn($s) => [
                    "id" => $s->id,
                    "name" => $s->name
                ])
            ]);

        return inertia("Ticket/Report", [
            "categories" => $categories
        ]);
    }
    public function exportExcel(Request $request)
    {
        $tickets = Ticket::query()
            ->when(
                $request->start_date,
                fn($q) =>
                $q->whereDate('start_date', '>=', $request->start_date)
            )
            ->when(
                $request->end_date,
                fn($q) =>
                $q->whereDate('start_date', '<=', $request->end_date)
            )
            ->when(
                $request->category,
                fn($q) =>
                $q->where('category_id', $request->category)
            )
            ->when(
                $request->sub_category,
                fn($q) =>
                $q->where('sub_category_id', $request->sub_category)
            )
            ->with([
                'gateway',
                'categoryRef',
                'subCategoryRef',
                'updates.user'
            ])
            ->orderBy('created_at', 'desc')
            ->get();


        $fileName = "ticket_report_" . now()->format("Ymd_His") . ".xlsx";

        $writer = WriterEntityFactory::createXLSXWriter();
        $writer->openToBrowser($fileName);

        // HEADER
        $header = WriterEntityFactory::createRowFromArray([
            "Ticket Number",
            "Gateway",
            "Category",
            "Sub Category",
            "Start Date",
            "Status",

            // HISTORY PER LINE
            "Update Date",
            "Updated By",
            "Flag",
            "Indication",
            "Action",
            "Description",
        ]);

        $writer->addRow($header);

        // ROWS
        foreach ($tickets as $t) {

            // Jika tidak ada history, tetap 1 row
            if ($t->updates->count() === 0) {
                $writer->addRow(
                    WriterEntityFactory::createRowFromArray([
                        $t->ticket_number,
                        $t->gateway->name ?? "-",
                        $t->categoryRef->name ?? "-",
                        $t->subCategoryRef->name ?? "-",
                        $t->start_date,
                        ucfirst($t->status),

                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                    ])
                );

                continue;
            }

            // Jika ada history, tiap history jadi baris baru
            foreach ($t->updates as $u) {

                $writer->addRow(
                    WriterEntityFactory::createRowFromArray([
                        $t->ticket_number,
                        $t->gateway->name ?? "-",
                        $t->categoryRef->name ?? "-",
                        $t->subCategoryRef->name ?? "-",
                        $t->start_date,
                        ucfirst($t->status),

                        // HISTORY
                        $u->created_at->format("Y-m-d H:i"),
                        $u->updated_by,
                        $u->flag,
                        $u->indication,
                        $u->action,
                        $u->description,
                    ])
                );
            }
        }

        $writer->close();
    }
}
