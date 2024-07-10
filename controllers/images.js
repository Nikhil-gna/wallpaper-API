const Image = require("../models/image");
const express = require("express");

const getAllImages = async (req, res) => {
  //search based filter in api
  const { name, format, tags, categories, sort, select } = req.query;
  const queryobj = {};
  if (format) {
    queryobj.format = { $regex: format, $options: "i" };
  }
  if (name) {
    queryobj.name = { $regex: name, $options: "i" };
  }
  // if (tags) {
  //   queryobj.tags = { $regex: tags, $options: "i" };
  // }
  if (categories) {
    // queryobj.categories = { $in: categories};
    queryobj.categories = { $regex: categories, $options: "i" };
  }

  //adding sorting filter
  let apidata = Image.find(queryobj);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    apidata = apidata.sort(sortList);
    // queryobj.sort = sortList;
  }

  //adding select filter

  if (select) {
    const selectList = select.split(",").join(" ");
    apidata = apidata.select(selectList);
  }
  // //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;

  const skip = (page - 1) * limit;
  apidata = apidata.skip(skip).limit(limit);

  //getting data from database
  const myData = await apidata;

  res.status(200).json(myData);
  //   res.status(200).json({ myData, NoOfData: myData.length });
};

//testing purpose
const getAllImagesTest = async (req, res) => {
  //for only imageurl and name
  // const myData = await Image.find(req.query).select("name url");

  const myData = await Image.find(req.query);
  //getting unique data
  const uniqueCategories = new Set();
  myData.forEach((item) => {
    item.categories.forEach((category) => {
      uniqueCategories.add(category);
    });
  });
  const Uniquecategories = Array.from(uniqueCategories);

  console.log(req.query);

  res.status(200).json({ myData, NoOfData: myData.length, Uniquecategories });
  // res.status(200).json({ myData, NoOfData: myData.length });
};

module.exports = { getAllImages, getAllImagesTest };
