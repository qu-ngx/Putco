import { useState } from "react";
import React, { useEffect } from 'react';

import Posts from "../../../components/social-media-view/posts";
import CreatePost from "../../../pages/social-media-view/home/create-post";

const HomePage = () => {
  return (
    <div className='flex-grow flex-col min-h-screen'>
      {/* CREATE POST INPUT */}
      <CreatePost />

      {/* POSTS */}
      <div className='flex-grow'>
        <Posts />
      </div>
    </div>
  );
};

export default HomePage;
