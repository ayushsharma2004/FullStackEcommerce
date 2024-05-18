import { db } from '../DB/firestore.js';
import slugify from 'slugify';
import fs from 'fs';
import { log } from 'console';

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is Required' });
      case !description:
        return res.status(500).send({ error: 'Description is Required' });
      case !price:
        return res.status(500).send({ error: 'Price is Required' });
      case !category:
        return res.status(500).send({ error: 'Category is Required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is Required' });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: 'Photo is Required and should be less than 1mb' });
    }

    // Create Products
    const products = {
      ...req.fields,
      price: parseInt(price),
      slug: slugify(name),
    };

    // Check if the 'photo' property exists in the 'products' object
    if (photo) {
      // Read file data as a Buffer
      const fileData = fs.readFileSync(photo.path);
      // Include relevant file information in 'products'
      products.photo = {
        data: fileData,
        contentType: photo.type,
      };
    }

    await db.collection(process.env.collectionProduct).doc(name).set(products);
    res.status(201).send({
      success: true,
      message: 'New Product created',
      products,
    });

    //Existing user?
    // const querySnapshot = await db
    //   .collection(process.env.collectionCategory)
    //   .where('name', '==', name)
    //   .get();
    // if (!querySnapshot.empty) {
    //   return res.status(200).send({
    //     success: true,
    //     message: 'Category already exists',
    //   });
    // }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in product',
      error: error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    var photoData = {};
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is Required' });
      case !description:
        return res.status(500).send({ error: 'Description is Required' });
      case !price:
        return res.status(500).send({ error: 'Price is Required' });
      case !category:
        return res.status(500).send({ error: 'Category is Required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is Required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: 'photo is Required and should be less then 1mb' });
    }

    const querySnapshot = await db
      .collection(process.env.collectionProduct)
      .where('slug', '==', req.params.slug)
      .get();


    // Check if the 'photo' property exists in the 'products' object
    if (photo) {
      // Read file data as a Buffer
      const fileData = fs.readFileSync(photo.path);
      // Include relevant file information in 'products'
      photoData.photo = {
        data: fileData,
        contentType: photo.type,
      };
    }

    // Update each document in the query results
    var product;
    querySnapshot.forEach((doc) => {
      const updateData = { ...req.fields, slug: slugify(name) };
      if (photoData.photo) {
        updateData.photo = photoData.photo;
      }
      product = doc.ref.update(updateData);
    });

    //update product
    res.status(201).send({
      success: true,
      message: 'Product updated',
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in update  product',
      error: error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const snapshot = await db
      .collection(process.env.collectionProduct)
      .limit(20)
      .get();

    // Rest of the code remains the same

    const products = [];

    for (const doc of snapshot.docs) {
      const { photo, category, ...productDataWithoutPhoto } = doc.data();

      let categoryData = null;
      categoryData = {
        category_name: category,
        category_slug: slugify(category),
      };
      products.push({
        id: doc.id,
        category: categoryData,
        ...productDataWithoutPhoto,
      });
    }

    await res.status(201).send({
      success: true,
      message: 'All Product List',
      total: products.length,
      products: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting all product',
      error: error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const slug = req.params.slug;
    const querySnapshot = await db
      .collection(process.env.collectionProduct)
      .where('slug', '==', slug)
      .get();

    let products = null;
    querySnapshot.forEach(async (doc) => {
      const { photo, category, ...productDataWithoutPhoto } = doc.data();

      let categoryData = null;
      categoryData = {
        category_name: category,
        category_slug: slugify(category),
      };
      products = {
        id: doc.id,
        category: categoryData,
        ...productDataWithoutPhoto,
      };
      await res.status(201).send({
        success: true,
        message: 'Get Single Product Successfully',
        products: products,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting single product',
      error: error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const querySnapshot = await db
      .collection(process.env.collectionProduct)
      .where('slug', '==', req.params.slug)
      .get();
    var docSnapshot;
    querySnapshot.forEach((doc) => {
      docSnapshot = doc.data();
    })

    if (docSnapshot) {
      const { photo } = docSnapshot;
      if (photo.data) {
        res.set('Content-type', photo.contentType);
        return res.status(200).send(photo.data);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting photo',
      error: error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    console.log(req.params.slug);
    const querySnapshot = await db
      .collection(process.env.collectionProduct)
      .where('slug', '==', req.params.slug)
      .get();
    //validate
    if (!querySnapshot) {
      return res.status(404).send({
        success: false,
        message: 'No such product exists',
      });
    }

    // Read and Delete each document in the query results
    var docSnapshot;
    querySnapshot.forEach((doc) => {
      docSnapshot = doc.data();
      doc.ref.delete();
    });

    res.status(201).send({
      success: true,
      message: 'Product Deleted Successfully',
      docRef: docSnapshot,
      id: req.params.slug,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while deleting product',
      error: error,
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    //checked = [id1, id2, ...]
    //price = [p1, p2]
    const { checked, radio } = req.body;
    let query = db.collection(process.env.collectionProduct);
    if (checked.length > 0) {
      query = query.where('category', 'in', checked);
    }
    if (radio.length > 0) {
      query = query.where('price', '>=', radio[0]).where('price', '<=', radio[1]);
    }
    const snapshot = await query.get();
    const products = [];
    snapshot.forEach((doc) => {
      products.push(doc.data());
    });
    res.status(200).send({
      success: true,
      products
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const snapshot = await db.collection(process.env.collectionProduct).get();
    const total = snapshot.size;
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? parseInt(req.params.page) : 1;
    const snapshot = await db.collection(process.env.collectionProduct)
      .orderBy('price', 'asc')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .get();
    const products = [];
    snapshot.forEach((doc) => {
      products.push(doc.data());
    });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
