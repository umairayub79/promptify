"use client";

import { useCallback, useEffect, useState } from "react";
import PromptCard from "./PromptCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchText, setSearchText] = useState(searchParams.get('search') || "");
 
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
 
      setSearchText(value)
      return params.toString()
    },
    [searchParams]
  )
 
  
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        router.push(pathname + '?' + createQueryString('search', e.target.value))
      }, 1000)
    );
  };
  
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/prompt?search=${searchText}`);
      const data = await res.json();

      setPosts(data);
    };
    fetchPosts();
  }, [searchParams]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={posts} handleTagClick={(tag) => {router.push(pathname + '?' + createQueryString('search', tag))}} />
    </section>
  );
};

export default Feed;
