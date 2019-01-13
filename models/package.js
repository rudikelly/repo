'use strict';

const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  bundleId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
    trim: true,
  },
  authorEmail: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  downloads: {
    type: Number,
    required: true,
  },
  downloadCount: {
    type: Number,
    required: true,
  },
  version: {
    type: String,
    required: true,
    trim: true,
  },
  dependencies: {
    type: Array,
  },
});

const Package = mongoose.model('Package', PackageSchema);

module.exports = Package;
