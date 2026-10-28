<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use App\Models\SubDepartment;
use App\Models\Gateway;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->q;
        $timeRange = $request->timeRange ?? '90d';

        // Rentang waktu
        $dateLimit = match ($timeRange) {
            '7d'  => now()->subDays(7),
            '30d' => now()->subDays(30),
            default => now()->subDays(90),
        };

        // Ambil user + relasi
        $users = User::with([
            'department:id,name',
            'subDepartment:id,name',
            'gateway:id,name',
            'position:id,name',
        ])
            ->where('role', '!=', 'admin') // hide admin
            ->where('created_at', '>=', $dateLimit)
            ->when($q, function ($query) use ($q) {
                $query->where(function ($q2) use ($q) {
                    $q2->where('name', 'like', "%$q%")
                        ->orWhere('email', 'like', "%$q%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Admin/UserManagement', [
            'users' => $users,

            // 🔥 FIX: KIRIM DATA DROPDOWN
            'departments'     => Department::select('id', 'name')->get(),
            'subDepartments'  => SubDepartment::select('id', 'name')->get(),
            'gateways'        => Gateway::select('id', 'name')->get(),
            'positions'       => Position::select('id', 'name')->get(),

            'filters' => [
                'q' => $q,
                'timeRange' => $timeRange,
            ],
        ]);
    }

    public function json(Request $request)
    {
        $query = User::with([
            'department:id,name',
            'subDepartment:id,name',
            'gateway:id,name',
            'position:id,name',
        ])
            ->where('role', '!=', 'admin'); // Hide admin

        // FILTER UTAMA
        if ($request->filter_key && $request->filter_value) {
            $query->whereHas(
                explode('.', $request->filter_key)[0],
                function ($q) use ($request) {
                    $column = explode('.', $request->filter_key)[1] ?? 'name';
                    $q->where($column, $request->filter_value);
                }
            );
        }

        return response()->json(
            $query->paginate($request->per_page ?? 10)
        );
    }

    public function updateRole(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'role' => 'required'
        ]);

        $user = User::findOrFail($request->id);
        $user->role = $request->role;
        $user->save();

        return back()->with('success', 'Role updated!');
    }

    public function destroy($id)
    {
        if ($id == auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        User::findOrFail($id)->delete();

        return back()->with('success', 'User deleted!');
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
        ]);

        return back()->with('success', 'Profile updated');
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'department_id' => 'nullable|exists:departments,id',
            'sub_department_id' => 'nullable|exists:sub_departments,id',
            'gateway_id' => 'nullable|exists:gateways,id',
            'position_id' => 'nullable|exists:positions,id',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'department_id' => $request->department_id,
            'sub_department_id' => $request->sub_department_id,
            'gateway_id' => $request->gateway_id,
            'position_id' => $request->position_id,
        ]);

        return response()->json(['success' => true]);
    }
}
