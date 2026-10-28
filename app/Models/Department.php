<?php

// app/Models/Department.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function subDepartments()
    {
        return $this->hasMany(SubDepartment::class);
    }
}
