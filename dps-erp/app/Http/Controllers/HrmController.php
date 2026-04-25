<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use Illuminate\Http\Request;

class HrmController extends Controller
{
    public function index()
    {
        $employees = Employee::with('department')
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        
        $departments = Department::all();
        
        return inertia('HRM/Index', ['employees' => $employees, 'departments' => $departments]);
    }

    public function create()
    {
        $departments = Department::all();
        
        return inertia('HRM/Create', ['departments' => $departments]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_number' => 'required|string|unique:employees|unique:employees,max:50',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'department_id' => 'nullable|exists:departments,id',
            'job_title' => 'nullable|string|max:100',
            'employment_type' => 'required|in:full_time,part_time,contract',
            'date_hired' => 'required|date',
            'phone' => 'nullable|string|max:30',
            'salary' => 'nullable|numeric|min:0',
        ]);

        Employee::create($validated);
        
        return redirect()->route('hrm.index')->with('success', 'Employee created successfully');
    }

    public function show(Employee $employee)
    {
        $employee->load(['department', 'leaveRequests', 'attendanceLogs']);
        
        return inertia('HRM/Show', ['employee' => $employee]);
    }

    public function edit(Employee $employee)
    {
        $departments = Department::all();
        
        return inertia('HRM/Edit', ['employee' => $employee, 'departments' => $departments]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'department_id' => 'nullable|exists:departments,id',
            'job_title' => 'nullable|string|max:100',
            'employment_type' => 'required|in:full_time,part_time,contract',
            'date_hired' => 'required|date',
            'phone' => 'nullable|string|max:30',
            'salary' => 'nullable|numeric|min:0',
        ]);

        $employee->update($validated);
        
        return redirect()->route('hrm.show', $employee->id)->with('success', 'Employee updated successfully');
    }
}