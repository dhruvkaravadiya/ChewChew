const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const mongoose = require('mongoose');

/*
async function createRestaurant(req,res){

}

async function deleteRestaurant(req,res){

}
*/
async function getAllRestaurants(req,res){
    const restuarants = await Restaurant.find();
    if(!restuarants || restuarants.length === 0){
        return res.status(404).json("No Restaurants found");
    }
    res.status(200).json(restuarants);
}

async function getRestaurantById(req,res){
    const restaurant = await Restaurant.findOne({_id:req.params.id});
    if(!restaurant){
        return  res.status(404).send("Restaurant not found");
    }
    res.status(200).send(restaurant);
}

async function updateRestaurantDetails(req,res){
    await Restaurant.findByIdAndUpdate(req.params.id , {$set : req.body}, {new:true});
    res.status(200).send("User Update Successfully");
}
module.exports = { getAllRestaurants, getRestaurantById, updateRestaurantDetails }