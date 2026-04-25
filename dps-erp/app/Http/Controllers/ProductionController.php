<?php

namespace App\Http\Controllers;

use App\Models\ProductionJob;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    public function index()
    {
        $jobs = ProductionJob::with(['assignedTo', 'order'])
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        
        return inertia('Production/Index', ['jobs' => $jobs]);
    }

    public function create()
    {
        return inertia('Production/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order_id' => 'nullable|exists:orders,id',
            'priority' => 'required|in:low,normal,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        ProductionJob::create(array_merge($validated, [
            'job_number' => ProductionJob::generateJobNumber(),
            'status' => 'queued',
        ]));
        
        return redirect()->route('production.index')->with('success', 'Job created successfully');
    }

    public function show(ProductionJob $job)
    {
        $job->load(['assignedTo', 'order', 'tasks', 'materials.product']);
        
        return inertia('Production/Show', ['job' => $job]);
    }

    public function edit(ProductionJob $job)
    {
        return inertia('Production/Edit', ['job' => $job]);
    }

    public function update(Request $request, ProductionJob $job)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,normal,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'status' => 'required|in:queued,in_progress,paused,completed,cancelled',
        ]);

        if ($validated['status'] === 'in_progress' && !$job->started_at) {
            $validated['started_at'] = now();
        }
        
        $job->update($validated);
        
        return redirect()->route('production.show', $job->id)->with('success', 'Job updated successfully');
    }
}