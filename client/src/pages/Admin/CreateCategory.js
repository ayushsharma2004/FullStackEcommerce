import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);

  //get all categories
  const getAllCategories = () => {
    try {
      const { data } = axios.get('/api/v1/category/get-category');
      if (data.success) {
        setCategories(data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while getting category');
    }
  };
  return (
    <Layout title={'Dashboard - Create Category'}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Category</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
