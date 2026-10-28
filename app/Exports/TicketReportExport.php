<?php

namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TicketReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        return Ticket::query()
            ->when($this->filters['start_date'] ?? null, fn($q) =>
                $q->whereDate('start_date', '>=', $this->filters['start_date'])
            )
            ->when($this->filters['end_date'] ?? null, fn($q) =>
                $q->whereDate('start_date', '<=', $this->filters['end_date'])
            )
            ->when($this->filters['category'] ?? null, fn($q) =>
                $q->where('category_id', $this->filters['category'])
            )
            ->when($this->filters['sub_category'] ?? null, fn($q) =>
                $q->where('sub_category_id', $this->filters['sub_category'])
            )
            ->with(['gateway'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            "Ticket Number",
            "Gateway",
            "Category",
            "Sub Category",
            "Start Date",
            "Status",
            "Alarm",
            "Indication",
        ];
    }

    public function map($t): array
    {
        return [
            $t->ticket_number,
            $t->gateway->name ?? "-",
            $t->category,
            $t->sub_category,
            $t->start_date,
            $t->status,
            $t->alarm,
            $t->indication,
        ];
    }
}
