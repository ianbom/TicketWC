<?php

namespace App\Http\Controllers\Ticket;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WorkInstruction;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class WorkInstructionController extends Controller
{
    public function index()
    {
        $wi = WorkInstruction::orderBy('created_at', 'desc')->get();

        // Ambil kategori unik
        $categories = WorkInstruction::select('category')
            ->distinct()
            ->pluck('category');

        // Ambil subcategory berdasarkan kategori (grouping)
        $subcategories = WorkInstruction::select('category', 'sub_category')
            ->whereNotNull('sub_category')
            ->get()
            ->groupBy('category')
            ->map(function ($items) {
                return $items->pluck('sub_category')->unique()->values();
            });

        return Inertia::render('Ticket/WorkInstruction', [
            'wi' => $wi,
            'role' => auth()->user()->role,
            'categories' => $categories,
            'subcategories' => $subcategories,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required',
            'sub_category' => 'nullable',
            'description' => 'nullable',
            'tags' => 'nullable',
            'file' => 'required|mimes:pdf,doc,docx,png,jpg,jpeg|max:5000',
        ]);

        $path = $request->file('file')->store('wi', 'public');

        WorkInstruction::create([
            'category' => $request->category,
            'sub_category' => $request->sub_category,
            'description' => $request->description,
            'tags' => $request->tags,
            'file_path' => $path,
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'File WI berhasil diupload!');
    }
    public function destroy($id)
    {
        // Ambil WI berdasarkan ID
        $wi = WorkInstruction::findOrFail($id);

        // Hapus file dari storage jika ada
        if ($wi->file_path && Storage::disk('public')->exists($wi->file_path)) {
            Storage::disk('public')->delete($wi->file_path);
        }

        // Hapus database record
        $wi->delete();

        return back()->with('success', 'Work Instruction berhasil dihapus!');
    }
}
