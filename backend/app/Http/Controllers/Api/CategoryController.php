<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(
            ServiceCategory::withCount('serviceRequests')->orderBy('name')->get()
        );
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        return (new CategoryResource(ServiceCategory::create($request->validated())))
            ->response()->setStatusCode(201);
    }

    public function show(ServiceCategory $category): CategoryResource
    {
        return new CategoryResource($category->loadCount('serviceRequests'));
    }

    public function update(CategoryRequest $request, ServiceCategory $category): CategoryResource
    {
        $category->update($request->validated());

        return new CategoryResource($category);
    }

    public function destroy(ServiceCategory $category): Response|JsonResponse
    {
        if ($category->serviceRequests()->exists()) {
            return response()->json(['message' => 'This category is used by existing requests and cannot be deleted.'], 409);
        }

        $category->delete();

        return response()->noContent();
    }
}
