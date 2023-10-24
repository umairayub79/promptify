"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";

import Form from "@components/Form";
import { useSession } from "next-auth/react";

const UpdatePrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const { data: session, status } = useSession();

  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      redirect("/");
    }
  }, [status]);

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {status === "authenticated" && (
        <Form
          type="Edit"
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={updatePrompt}
        />
      )}
    </>
  );
};

export default UpdatePrompt;
