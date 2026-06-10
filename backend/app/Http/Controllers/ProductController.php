<?php

namespace App\Http\Controllers;
   use App\Models\Product;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
return response()->json([
'data' => $products,
'message' => 'Products retrieved successfully',
'count' => $products->count(),
], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
   
    /**
     * Store a newly created resource in storage.
     */


public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer|min:0',
       'category_name' => 'required|string|max:255',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'is_active' => 'boolean'
    ]);

    $imageUrl = null;

    if ($request->hasFile('image')) {

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
        ]);

        $uploaded = $cloudinary->uploadApi()->upload(
            $request->file('image')->getRealPath()
        );

        $imageUrl = $uploaded['secure_url'];
    }
$category = \App\Models\Category::firstOrCreate([
    'name' => $validated['category_name']
]);
    $product = Product::create([
        'name' => $validated['name'],
        'slug' => Str::slug($validated['name']) . '-' . time(),
        'description' => $validated['description'] ?? null,
        'price' => $validated['price'],
        'stock' => $validated['stock'],
        'image' => $imageUrl,
        'category_id' => $category->id,
        'is_active' => $validated['is_active'] ?? true,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Product created successfully',
        'data' => $product
    ], 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json([
            'data' => $product,
            'message' => 'Product retrieved successfully',
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    
    {
$validated = $request->validate([
        'name'=>'sometimes|string|max:255',
        'slug' => 'sometimes|string|max:255|unique:products,slug,' . $product->id,
        'description'=>'sometimes|string',
        'price'=>'sometimes|numeric',
        'stock'=>'sometimes|integer',
        'image'=>'sometimes|string|max:255',
        'category_name'=>'sometimes|string|max:255',
        'is_active'=>'sometimes|boolean'
]);
if ($request->has('category_name')) {
    $category = \App\Models\Category::firstOrCreate([
        'name' => $request->category_name
    ]);

    $validated['category_id'] = $category->id;
}
        $product->update($validated);

        return response()->json([
            'data'    => $product->fresh(),
            'message' => 'Product updated successfully',
        ], 200);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {

$product->delete();
return response()->json([
'message' => 'Product deleted successfully',
], 200);
    }
}
