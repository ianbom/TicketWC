<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Gateway;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ============ TOTAL TICKETS ============
        $total_tickets = Ticket::count();

        // ============ SUMMARY PER CATEGORY (PAKAI RELASI) ============
        $summary = Ticket::with('categoryRef')
            ->selectRaw("category_id, COUNT(*) as total")
            ->groupBy("category_id")
            ->get()
            ->map(function ($row) {
                return [
                    "category" => $row->categoryRef->name ?? "-",
                    "total" => $row->total
                ];
            });

        // ============ GATEWAY LIST ============
        $gateways = Gateway::orderBy('code')->pluck('code')->toArray();

        // ============ CATEGORY LIST (distinct by ID) ============
        $categories = Ticket::with('categoryRef')
            ->select('category_id')
            ->distinct()
            ->get()
            ->map(fn($t) => $t->categoryRef->name ?? "-");

        // ============ MATRIX (Category x Gateway) ============
        $matrix = [];

        foreach ($categories as $catName) {
            $row = ["category" => $catName];

            foreach ($gateways as $gw) {
                $count = Ticket::whereHas("categoryRef", fn ($q) => $q->where("name", $catName))
                    ->whereHas("gateway", fn ($q) => $q->where("code", $gw))
                    ->count();

                $row[$gw] = $count ?: "-";
            }

            $matrix[] = $row;
        }

        return Inertia::render("Ticket/Dashboard", [
            "total_tickets"       => $total_tickets,
            "summaryCategories"   => $summary,
            "matrix"              => $matrix,
            "gateways"            => $gateways,
        ]);
    }
}
