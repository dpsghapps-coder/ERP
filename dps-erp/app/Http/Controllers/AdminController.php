<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'recent_activity' => AuditLog::orderBy('created_at', 'desc')->limit(10)->get(),
        ];
        
        return inertia('Admin/Index', $stats);
    }

    public function users()
    {
        $users = User::with('role')->orderBy('created_at', 'desc')->paginate(25);
        
        return inertia('Admin/Users/Index', ['users' => $users]);
    }

    public function userCreate()
    {
        $roles = \App\Models\Role::all();
        
        return inertia('Admin/Users/Create', ['roles' => $roles]);
    }

    public function userStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'nullable|exists:roles,id',
            'is_active' => 'boolean',
        ]);

        User::create($validated);
        
        return redirect()->route('admin.users')->with('success', 'User created successfully');
    }

    public function userEdit(User $user)
    {
        $roles = \App\Models\Role::all();
        
        return inertia('Admin/Users/Edit', ['user' => $user, 'roles' => $roles]);
    }

    public function userUpdate(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role_id' => 'nullable|exists:roles,id',
            'is_active' => 'boolean',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = $request->password;
        }

        $user->update($validated);
        
        return redirect()->route('admin.users')->with('success', 'User updated successfully');
    }

    public function roles()
    {
        $roles = \App\Models\Role::with('permissions')->get();
        $permissions = \App\Models\Permission::all();
        
        return inertia('Admin/Roles/Index', ['roles' => $roles, 'permissions' => $permissions]);
    }

    public function settings()
    {
        $uoms = \App\Models\Setting::where('key', 'like', 'uom_%')->get();
        $categories = \App\Models\Setting::where('key', 'like', 'category_%')->get();
        
        return inertia('Admin/Settings', ['uoms' => $uoms, 'categories' => $categories]);
    }

    public function settingsUpdate(Request $request)
    {
        return back()->with('success', 'Settings saved successfully');
    }

    public function storeUom(Request $request)
    {
        $validated = $request->validate(['value' => 'required|string|max:50']);
        
        \App\Models\Setting::create([
            'key' => 'uom_' . str_slug($validated['value']),
            'value' => $validated['value'],
            'type' => 'string',
        ]);
        
        return back()->with('success', 'UOM added successfully');
    }

    public function deleteUom(Setting $setting)
    {
        if (str_starts_with($setting->key, 'uom_')) {
            $setting->delete();
        }
        return back()->with('success', 'UOM deleted');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate(['value' => 'required|string|max:50']);
        
        \App\Models\Setting::create([
            'key' => 'category_' . str_slug($validated['value']),
            'value' => $validated['value'],
            'type' => 'string',
        ]);
        
        return back()->with('success', 'Category added successfully');
    }

    public function deleteCategory(Setting $setting)
    {
        if (str_starts_with($setting->key, 'category_')) {
            $setting->delete();
        }
        return back()->with('success', 'Category deleted');
    }
}