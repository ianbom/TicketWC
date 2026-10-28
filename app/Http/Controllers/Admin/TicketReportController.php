<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenSpout\Writer\XLSX\Writer;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function downloadReport(Request $request)
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
            ->with(['gateway', 'categoryRef', 'subCategoryRef'])
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = "ticket_report_" . now()->format("Ymd_His") . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
        ];

        $callback = function () use ($tickets) {
            $file = fopen('php://output', 'w');

            // HEADER CSV
            fputcsv($file, [
                "Ticket Number",
                "Gateway",
                "Category",
                "Sub Category",
                "Start Date",
                "Status",
                "Alarm",
                "Indication"
            ]);

            // DATA CSV
            foreach ($tickets as $t) {
                fputcsv($file, [
                    $t->ticket_number,
                    $t->gateway->name ?? "-",
                    $t->categoryRef->name ?? "-",
                    $t->subCategoryRef->name ?? "-",
                    $t->start_date,
                    ucfirst($t->status),
                    $t->alarm,
                    $t->indication,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
