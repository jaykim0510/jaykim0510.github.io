---
layout: post
title:  'MongoDB Series [Part6]: MongoDB Operators'
description: 
date:   2022-01-04 15:01:35 +0300
image:  '/images/mongodb_logo.png'
logo_image:  '/images/mongo_logo.png'
categories: data_engineering
tags: MongoDB
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


MongoDB offers different types of operators that can be used to interact with the database. Operators are special symbols or keywords that inform a compiler or an interpreter to carry out mathematical or logical operations.


# Query and Projection Operators

- The query operators enhance the functionality of MongoDB by allowing developers to create complex queries to interact with data sets that match their applications.


## Comparison Operators

|Operator|Description|
|:---:|:---:|
|$eq|Matches values that are equal to the given value.|
|$gt|Matches if values are greater than the given value.|
|$lt|Matches if values are less than the given value.|
|$gte|Matches if values are greater or equal to the given value.|
|$lte|Matches if values are less or equal to the given value.|
|$in|Matches any of the values in an array.|
|$ne|Matches values that are not equal to the given value.|
|$nin|Matches none of the values specified in an array.|

## Logical Operators

- MongoDB logical operators can be used to filter data based on given conditions. 
- These operators provide a way to combine multiple conditions. 
- Each operator equates the given condition to a true or false value.

|Operator|Description|
|:---:|:---:|
|$and|Joins two or more queries with a logical AND and returns the documents that match all the conditions.|
|$or|Join two or more queries with a logical OR and return the documents that match either query.|
|$nor|The opposite of the OR operator. The logical NOR operator will join two or more queries and return documents that do not match the given query conditions.|
|$not|Returns the documents that do not match the given query expression.|

## Element Operators

- The element query operators are used to identify documents using the fields of the document. 

|Operator|Description|
|:---:|:---:|
|$exists|Matches documents that have the specified field.|
|$type|Matches documents according to the specified field type. These field types are specified BSON types and can be defined either by type number or alias.|

## Evaluation Operators

- The MongoDB evaluation operators can evaluate the overall data structure or individual field in a document. 
- We are only looking at the basic functionality of these operators as each of these operators can be considered an advanced MongoDB functionality.


|Operator|Description|
|:---:|:---:|
|$jsonSchema|Validate the document according to the given JSON schema.|
|$mod|Matches documents where a given field’s value is equal to the remainder after being divided by a specified value.|
|$regex|Select documents that match the given regular expression.|
|$text|Perform a text search on the indicated field. The search can only be performed if the field is indexed with a text index.|
|$where|Matches documents that satisfy a JavaScript expression.|

## Array Operators

- MongoDB array operators are designed to query documents with arrays


|Operator|Description|
|:---:|:---:|
|$all|Matches arrays that contain all the specified values in the query condition.|
|$size|Matches the documents if the array size is equal to the specified size in a query.|
|$elemMatch|Matches documents that match specified $elemMatch conditions within each array element.|


## Projection Operators

|Operator|Description|
|:---:|:---:|
|$|Projects the first element in an array that matches the query condition.|
|$elemMatch|Projects the first element in an array that matches the specified $elemMatch condition.|
|$meta|Projects the document's score assigned during $text operation.|
|$slice|Limits the number of elements projected from an array. Supports skip and limit slices.|


# Update Operators

## Fields Operators

|Operator|Description|
|:---:|:---:|
|$currentDate|Sets the value of a field to current date, either as a Date or a Timestamp.|
|$inc|Increments the value of the field by the specified amount.|
|$min|Only updates the field if the specified value is less than the existing field value.|
|$max|Only updates the field if the specified value is greater than the existing field value.|
|$mul|Multiplies the value of the field by the specified amount.|
|$rename|Renames a field.|
|$set|Sets the value of a field in a document.|
|$setOnInsert|Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents.|
|$unset|Removes the specified field from a document.|

## Array Operators

|Operator|Description|
|$|Acts as a placeholder to update the first element that matches the query condition.|
|$[]|Acts as a placeholder to update all elements in an array for the documents that match the query condition.|
|$[\<identifier\>]|Acts as a placeholder to update all elements that match the arrayFilters condition for the documents that match the query condition.|
|$addToSet|Adds elements to an array only if they do not already exist in the set.|
|$pop|Removes the first or last item of an array.|
|$pull|Removes all array elements that match a specified query.|
|$push|Adds an item to an array.|
|$pullAll|Removes all matching values from an array.|

## Array Modifiers

|Operator|Description|
|:---:|:---:|
|$each|Modifies the $push and $addToSet operators to append multiple items for array updates.|
|$position|Modifies the $push operator to specify the position in the array to add elements.|
|$slice|Modifies the $push operator to limit the size of updated arrays.|
|$sort|Modifies the $push operator to reorder documents stored in an array.|

# Aggregation Pipeline Stages

|Operator|Description|
|:---:|:---:|
|$addFields|Adds new fields to documents. Outputs documents that contain all existing fields from the input documents and newly added fields.|
|$bucket|Categorizes incoming documents into groups, called buckets, based on a specified expression and bucket boundaries.|
|$bucketAuto|Categorizes incoming documents into a specific number of groups, called buckets, based on a specified expression. Bucket boundaries are automatically determined in an attempt to evenly distribute the documents into the specified number of buckets.|
|$changeStream|Returns a Change Stream cursor for the collection or database. This stage can only occur once in an aggregation pipeline and it must occur as the first stage.|
|$collStats|Returns statistics regarding a collection or view.|
|$count|Returns a count of the number of documents at this stage of the aggregation pipeline. Distinct from the $count aggregation accumulator.|
|$currentOp|Returns information on active and/or dormant operations for the MongoDB deployment. To run, use the db.aggregate() method.|
|$densify|Creates new documents in a sequence of documents where certain values in a field are missing.|
|$documents|Returns literal documents from input values.|
|$facet|Processes multiple aggregation pipelines within a single stage on the same set of input documents. Enables the creation of multi-faceted aggregations capable of characterizing data across multiple dimensions, or facets, in a single stage.|
|$fill|Populates null and missing field values within documents.|
|$geoNear|Returns an ordered stream of documents based on the proximity to a geospatial point. Incorporates the functionality of $match, $sort, and $limit for geospatial data. The output documents include an additional distance field and can include a location identifier field.|
|$graphLookup|Performs a recursive search on a collection. To each output document, adds a new array field that contains the traversal results of the recursive search for that document.|
|$group|Groups input documents by a specified identifier expression and applies the accumulator expression(s), if specified, to each group. Consumes all input documents and outputs one document per each distinct group. The output documents only contain the identifier field and, if specified, accumulated fields.|
|$indexStats|Returns statistics regarding the use of each index for the collection.|
|$limit|Passes the first n documents unmodified to the pipeline where n is the specified limit. For each input document, outputs either one document (for the first n documents) or zero documents (after the first n documents).|
|$listLocalSessions|Lists all active sessions recently in use on the currently connected mongos or mongod instance. These sessions may have not yet propagated to the system.sessions collection.|
|$listSessions|Lists all sessions that have been active long enough to propagate to the system.sessions collection.|
|$lookup|Performs a left outer join to another collection in the same database to filter in documents from the "joined" collection for processing.|
|$match|Filters the document stream to allow only matching documents to pass unmodified into the next pipeline stage. $match uses standard MongoDB queries. For each input document, outputs either one document (a match) or zero documents (no match).|
|$merge|Writes the resulting documents of the aggregation pipeline to a collection. The stage can incorporate (insert new documents, merge documents, replace documents, keep existing documents, fail the operation, process documents with a custom update pipeline) the results into an output collection. To use the $merge stage, it must be the last stage in the pipeline.|
|$out|Writes the resulting documents of the aggregation pipeline to a collection. To use the $out stage, it must be the last stage in the pipeline.|
|$project|Reshapes each document in the stream, such as by adding new fields or removing existing fields. For each input document, outputs one document.|
|$redact|Reshapes each document in the stream by restricting the content for each document based on information stored in the documents themselves. Incorporates the functionality of $project and $match. Can be used to implement field level redaction. For each input document, outputs either one or zero documents.|
|$replaceRoot|Replaces a document with the specified embedded document. The operation replaces all existing fields in the input document, including the _id field. Specify a document embedded in the input document to promote the embedded document to the top level.|
|$replaceWith|Replaces a document with the specified embedded document. The operation replaces all existing fields in the input document, including the _id field. Specify a document embedded in the input document to promote the embedded document to the top level. Alias for $replaceRoot.|
|$sample|Randomly selects the specified number of documents from its input.|
|$set|Adds new fields to documents. Outputs documents that contain all existing fields from the input documents and newly added fields. Alias for $addFields.|
|$setWindowFields|Groups documents into windows and applies one or more operators to the documents in each window.|
|$shardedDataDistribution|Provides data and size distribution information on sharded collections.|
|$skip|Skips the first n documents where n is the specified skip number and passes the remaining documents unmodified to the pipeline. For each input document, outputs either zero documents (for the first n documents) or one document (if after the first n documents).|
|$sort|Reorders the document stream by a specified sort key. Only the order changes; the documents remain unmodified. For each input document, outputs one document.|
|$sortByCount|Groups incoming documents based on the value of a specified expression, then computes the count of documents in each distinct group.|
|$unionWith|Performs a union of two collections; i.e. combines pipeline results from two collections into a single result set.|
|$unset|Removes/exludes fields from documents. Alias for $project stage that excludes/removes fields.|
|$unwind|Deconstructs an array field from the input documents to output a document for each element. Each output document replaces the array with an element value. For each input document, outputs n documents where n is the number of array elements and can be zero for an empty array.|

# Aggregation Pipeline Operators

|Operator|Description|
|:---:|:---:|
|$abs|Returns the absolute value of a number.|
|$accumulator|Returns the result of a user-defined accumulator function.|
|$add|Adds numbers to return the sum, or adds numbers and a date to return a new date. If adding numbers and a date, treats the numbers as milliseconds. Accepts any number of argument expressions, but at most, one expression can resolve to a date.|
|$addToSet|Returns an array of unique expression values for each group. Order of the array elements is undefined.|
|$allElementsTrue|Returns true if no element of a set evaluates to false, otherwise, returns false. Accepts a single argument expression.|
|$and|Returns true only when all its expressions evaluate to true. Accepts any number of argument expressions.|
|$anyElementTrue|Returns true if any elements of a set evaluate to true; otherwise, returns false. Accepts a single argument expression.|
|$arrayElemAt|Returns the element at the specified array index.|
|$arrayToObject|Converts an array of key value pairs to a document.|
|$asin|Returns the inverse sine (arc sine) of a value in radians.|
|$asinh|Returns the inverse hyperbolic sin (hyperbolic arc sine) of a value in radians.|
|$atan|Returns the inverse tangent (arc tangent) of a value in radians.|
|$avg|Returns an average of numerical values. Ignores non-numeric values.|
|$binarySize|Returns the size of a given string or binary data value's content in bytes.|
|$concat|Concatenates any number of strings.|
|$dateFromString|Returns a date/time as a date object.|
|$dateToString|Returns the date as a formatted string.|
|$filter|Selects a subset of the array to return an array with only the elements that match the filter condition.|
|$first|Returns a value from the first document for each group. Order is only defined if the documents are sorted.|
|$push|Returns an array of expression values for documents in each group.|
|$split|Splits a string into substrings based on a delimiter. Returns an array of substrings. If the delimiter is not found within the string, returns an array containing the original string.|
...







- [MongoDB 공식문서 Operator](https://www.mongodb.com/docs/manual/reference/operator/){:target="_blank"}
- [bmc, 23 Common MongoDB Operators & How To Use Them](https://www.bmc.com/blogs/mongodb-operators/){:target="_blank"}