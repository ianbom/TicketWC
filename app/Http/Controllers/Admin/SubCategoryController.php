<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    /**
     * Store new sub category
     */
    public function store(Request $request, $categoryId)
    {
        $request->validate([
            "name" => "required|string|max:255",
        ]);

        $category = Category::findOrFail($categoryId);

        // Cek duplikasi subcategory
        if ($category->subcategories()->where('name', $request->name)->exists()) {
            return back()->with('error', 'Sub Category sudah ada.');
        }

        $sub = SubCategory::create([
            "category_id" => $categoryId,
            "name"        => $request->name,
        ]);

        return response()->json([
            "message" => "Sub Category berhasil ditambahkan",
            "sub" => $sub
        ]);
    }

    /**
     * Delete sub category
     */
    public function destroy($id)
    {
        $sub = SubCategory::findOrFail($id);

        $sub->delete();

        return response()->json([
            "message" => "Sub Category berhasil dihapus"
        ]);
    }
}
