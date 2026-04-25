<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = ['name', 'manager_id'];

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'employee_number',
        'first_name',
        'last_name',
        'department_id',
        'job_title',
        'employment_type',
        'date_hired',
        'date_terminated',
        'salary',
        'pay_frequency',
        'phone',
        'emergency_contact',
    ];

    protected $casts = [
        'employment_type' => 'string',
        'date_hired' => 'date',
        'date_terminated' => 'date',
        'salary' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function attendanceLogs(): HasMany
    {
        return $this->hasMany(AttendanceLog::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}

class LeaveRequest extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type',
        'start_date',
        'end_date',
        'days_count',
        'reason',
        'status',
        'reviewed_by',
    ];

    protected $casts = [
        'leave_type' => 'string',
        'status' => 'string',
        'start_date' => 'date',
        'end_date' => 'date',
        'days_count' => 'decimal:1',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}

class AttendanceLog extends Model
{
    protected $fillable = [
        'employee_id',
        'date',
        'check_in',
        'check_out',
        'hours_worked',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'hours_worked' => 'decimal:2',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}