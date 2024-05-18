import { db } from '../DB/firestore.js';
import slugify from 'slugify';

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    //validate user
    if (!name) {
      return res.status(401).send({
        message: 'Name is required',
      });
    }

    //Existing user?
    const querySnapshot = await db
      .collection(process.env.collectionCategory)
      .where('name', '==', name)
      .get();
    if (!querySnapshot.empty) {
      return res.status(200).send({
        success: true,
        message: 'Category already exists',
      });
    }

    //creating category
    const categoryJson = {
      name: name,
      slug: slugify(name),
    };
    const category = await db
      .collection(process.env.collectionCategory)
      .doc(name)
      .set(categoryJson);
    res.status(201).send({
      success: true,
      message: 'New category created',
      category: category,
      categoryJson: categoryJson,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in category',
      error: error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    //update password
    const docRef = db.collection(process.env.collectionCategory).doc(id);
    const category = await docRef.update(
      { name: name, slug: slugify(name) },
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: 'Category updated',
      category: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in category',
      error: error,
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const snapshot = await db.collection(process.env.collectionCategory).get();

    const category = [];
    snapshot.forEach((doc) => {
      category.push({ id: doc.id, ...doc.data() });
    });
    res.status(201).send({
      success: true,
      message: 'All Categories List',
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting all category',
      error: error,
    });
  }
};

export const SingleCategoryController = async (req, res) => {
  try {
    const slug = req.params.slug;
    const querySnapshot = await db
      .collection(process.env.collectionCategory)
      .where('slug', '==', slug)
      .get();

    let category = null;
    querySnapshot.forEach((doc) => {
      category = doc.data();
    });
    res.status(201).send({
      success: true,
      message: 'Get Single Category Successfully',
      category: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting all category',
      error: error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection(process.env.collectionCategory).doc(id);

    //validate
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send({
        success: false,
        message: 'No such category exists',
      });
    }

    //delete
    await docRef.delete();
    console.log(docRef._converter);
    res.status(201).send({
      success: true,
      message: 'Category Deleted Successfully',
      docRef: docRef,
      id: id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error while getting all category',
      error: error,
    });
  }
};
