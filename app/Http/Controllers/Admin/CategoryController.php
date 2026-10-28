<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return inertia("Admin/CategoryManagement", [
            "categories" => Category::with('subcategories')
                ->orderBy('type')
                ->orderBy('name')
                ->get(),
        ]);
    }

    // ===========================
    // CREATE CATEGORY (AJAX)
    // ===========================
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255|unique:categories,name",
            "type" => "required|in:general,kb"
        ]);

        $category = Category::create($validated);

        return response()->json([
            "success" => true,
            "category" => $category->load('subcategories')
        ]);
    }

    // ===========================
    // DELETE CATEGORY (AJAX)
    // ===========================
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $category->subcategories()->delete();
        $category->delete();

        return response()->json([
            "success" => true,
            "message" => "Category deleted",
            "id" => $id
        ]);
    }
}
