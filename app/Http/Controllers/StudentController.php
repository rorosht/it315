<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Student;


class StudentController extends Controller
{
    private function rules(Request $request, $id = null)
    {
        return $request->validate([
            'student_id' => [
                'required',
                'string',
                Rule::unique('students', 'student_id')->ignore($id),
            ],

            'first_name' => 'required|string|max:50',

            'middle_name' => 'nullable|string|max:50',
            
            'last_name' => 'required|string|max:50',

            'email' => [
                'required',
                'email',
                Rule::unique('students', 'email')->ignore($id),
            ],

            'phone' => [
                'required',
                'string',
                'regex:/^[0-9]{11}$/',
                Rule::unique('students', 'phone')->ignore($id),
            ],

            'course' => 'required|string|max:50',

            'year_level' => 'required|integer|between:1,5',
        ]);
    }

    public function index()
    {
        return response()->json(
            Student::all(), 200
        );
    }

    public function store(Request $request)
    {
        $validated = $this->rules($request);
        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student created successfully',
            'data' => $student,
        ], 201);
    }

    public function show(Student $student)
    {
        return response()->json($student, 200);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $this->rules($request, $student->id);
        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully',
            'data' => $student,
        ], 200);
    }


    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfuly',
        ], 200);
    }
}
