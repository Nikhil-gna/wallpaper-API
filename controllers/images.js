const Image = require('../models/image');
const express = require('express');

const getAllImages = async (req,res) =>{
//search based filter in api
    const {name,format,tags,categories,sort,select} = req.query;
    const  queryobj = {};
    if(format){
        queryobj.format = { $regex: format, $options: 'i'};
    }
    if(name){
        queryobj.name = { $regex: name, $options: 'i'};
    }
    if(tags){
        queryobj.tags = { $in: tags };
    }
    if(categories){
        queryobj.categories = { $in: categories};
    }

//adding sorting filter
    let apidata =Image.find(queryobj);

    if(sort){
        const sortList = sort.split(",").join(" ");
        apidata = apidata.sort(sortList);
        // queryobj.sort = sortList;
    }

//adding select filter

    if(select){
        const selectList = select.split(",").join(" ");
        apidata = apidata.select(selectList);
    }
// //pagination
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 3;

//     const skip = (page-1)*limit;
//     apidata = apidata.skip(skip).limit(limit);

//getting data from database
    const myData = await apidata;
    res.status(200).json({myData,NoOfData:myData.length});
};

//testing purpose
const getAllImagesTest = async (req,res) =>{
    const myData = await Image.find(req.query).select('name url');
    console.log(req.query);
    res.status(200).json({myData});
};

module.exports= {getAllImages,getAllImagesTest};
