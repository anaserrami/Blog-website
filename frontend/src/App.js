import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import axios from "axios";
import "./input.css";

const CategoryPage = () => {
  const [categorie, setCategorie] = useState([]);
  const [content, setContent] = useState("");
  const [renderCounter, setRenderCounter] = useState(0);
  const [updatedContent, setUpdatedContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/categories/${categoryId}`
        );
        setCategorie(response.data.articles);
      } catch (error) {
        console.error("Error fetching category articles:", error);
      }
    };

    fetchCategoryArticles();
  }, [categoryId, renderCounter]);

  if (categorie.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleUpdatedContentChange = (e) => {
    setUpdatedContent(e.target.value);
  };

  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e, articleId, email) => {
    e.preventDefault();

    const commentData = {
      email: email,
      content: content,
      articleId: articleId,
    };

    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .post("http://localhost:3001/commentaires", commentData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then(() => {
          console.log("Creation comment successful:");
          //window.location.href = '/';
          setRenderCounter((old) => old + 1);
          setContent("");
        })
        .catch((error) => {
          console.error("Creation comment error:", error);
        });
    }
  };

  const handleUpdate = async (commentId, updatedContent) => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .patch(
          `http://localhost:3001/commentaires/${commentId}`,
          { content: updatedContent },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then(() => {
          console.log("Update comment successful");
          setRenderCounter((old) => old + 1);
          setContent("");
          setEditingCommentId(null);
        })
        .catch((error) => {
          console.error("Update comment error:", error);
        });
    }
  };

  const handleDelete = async (commentId) => {
    if (!token) {
      window.location.href = "/login";
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (confirmed) {
        axios
          .delete(`http://localhost:3001/commentaires/${commentId}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then(() => {
            console.log("Delete comment successful");
            //window.location.href = '/';
            setRenderCounter((old) => old + 1);
            setContent("");
          })
          .catch((error) => {
            console.error("Delete comment error:", error);
          });
      }
    }
  };

  return (
    <div>
      <section id="blog-h" className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              Welcome to Blog<span className="text-blue font-bold">Yoo!!</span>
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Fell!! Read!! Write!! Share!! blogs. Yes, here you can fell free
              to write and read your <b>Blogs</b> when & where you want and
              share yours <b>Ideas</b> with others.
            </p>
            <a
              href="#our-blogs"
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Discover
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  transform="rotate(90 10 10)"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="http://localhost:3001/images/blog.jpg" alt="mockup" />
          </div>
        </div>
      </section>

      <h1 id="our-blogs" className="text-left ml-16 my-12 text-3xl font-bold">
        <span className="border-b-4 border-blue-500">Our Blogs</span>
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {categorie.map((article) => (
          <div
            key={article.id}
            className="max-w-4xl p-4 bg-white shadow-lg rounded-lg w-full"
          >
            <div className="flex items-center">
              <div className="w-55 h-55 mr-5">
                {article.image && (
                  <img
                    src={article.image + "?random=" + article.id}
                    alt="Article"
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <h5 className="font-semibold text-gray-800 mb-2">
                  <i className="fas fa-user-circle text-gray-600 mr-2"></i>
                  {article.author.name}{" "}
                  <span className="text-black text-xs">
                    (created at: {article.createdAt.split("T")[0]},{" "}
                    {article.createdAt.split("T")[1].split(":")[0]}:
                    {article.createdAt.split("T")[1].split(":")[1]})
                  </span>
                </h5>
                <div className="flex flex-row">
                  {article.categories.map((categorie) => (
                    <button
                      key={categorie.id}
                      className="rounded-full bg-sky-50 mb-2 p-1 mx-1 border-solid border-2 border-blue-400"
                    >
                      <Link to={`/categories/${categorie.id}`}>
                        {categorie.name}
                      </Link>
                    </button>
                  ))}
                </div>
                <h2 className="text-lg font-bold mb-2">{article.title}</h2>
                <p className="text-gray-700 text-justify">{article.content}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold mb-2">
                <span className="border-b-4 border-blue-500">Comments</span>
              </p>
              <form
                className="mb-3"
                onSubmit={(e) => handleSubmit(e, article.id, user.email)}
              >
                <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <label htmlFor="comment" className="sr-only">
                    Your comment
                  </label>
                  <textarea
                    id="comment"
                    rows="2"
                    onChange={handleContentChange}
                    value={content}
                    className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                    placeholder="Write a comment..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                >
                  Post comment
                </button>
              </form>
              <div className="max-h-60 overflow-y-auto pl-4 scrollbar">
                {article.comments
                  .sort((a, b) => b.id - a.id)
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="mt-2 border-t border-gray-300"
                    >
                      <h5 className="text-gray-800">
                        <i className="fas fa-user-circle text-gray-600 mr-2"></i>
                        <b>{comment.email.split("@")[0]}</b>
                      </h5>
                      <p className="text-gray-500 ml-5 flex justify-between">
                        {comment.content}
                        {user && comment.email === user.email && (
                          <div className="flex justify-end mt-2">
                            {editingCommentId === comment.id ? (
                              <React.Fragment>
                                <textarea
                                  rows="2"
                                  value={updatedContent}
                                  onChange={handleUpdatedContentChange}
                                  className="px-2 py-1 border border-gray-300 rounded-md mx-2"
                                ></textarea>
                                <button
                                  className="text-blue-500 ml-2 mx-2 rounded-md border border-blue-500 p-2"
                                  onClick={() =>
                                    handleUpdate(comment.id, updatedContent)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="text-red-500 ml-2 mx-2 rounded-md border border-red-500 p-1"
                                  onClick={() => handleDelete(comment.id)}
                                >
                                  Delete
                                </button>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <button
                                  className="text-blue-500 mr-2 mx-2 rounded-md border border-blue-500 p-1"
                                  onClick={() => handleEditComment(comment.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-red-500 mx-2 rounded-md border border-red-500 p-1"
                                  onClick={() => handleDelete(comment.id)}
                                >
                                  Delete
                                </button>
                              </React.Fragment>
                            )}
                          </div>
                        )}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 ">
      <h1 className="text-center mb-8 text-3xl font-bold">
        <span className="border-b-4 border-blue-500">Our Categories</span>
      </h1>
      <ul className="max-w-md mx-auto">
        {categories.map((category) => (
          <li key={category.id} className="text-xl mb-2 flex justify-between">
            <Link to={`/categories/${category.id}`}>{category.name}</Link>
            <span>({category.articles.length})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [content, setContent] = useState("");
  const [renderCounter, setRenderCounter] = useState(0);
  const [updatedContent, setUpdatedContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3001/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [renderCounter]);

  if (articles.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleUpdatedContentChange = (e) => {
    setUpdatedContent(e.target.value);
  };

  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e, articleId, email) => {
    e.preventDefault();

    const commentData = {
      email: email,
      content: content,
      articleId: articleId,
    };

    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .post("http://localhost:3001/commentaires", commentData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then(() => {
          console.log("Creation comment successful:");
          //window.location.href = '/';
          setRenderCounter((old) => old + 1);
          setContent("");
        })
        .catch((error) => {
          console.error("Creation comment error:", error);
        });
    }
  };

  const handleUpdate = async (commentId, updatedContent) => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .patch(
          `http://localhost:3001/commentaires/${commentId}`,
          { content: updatedContent },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then(() => {
          console.log("Update comment successful");
          setRenderCounter((old) => old + 1);
          setContent("");
          setEditingCommentId(null);
        })
        .catch((error) => {
          console.error("Update comment error:", error);
        });
    }
  };

  const handleDelete = async (commentId) => {
    if (!token) {
      window.location.href = "/login";
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (confirmed) {
        axios
          .delete(`http://localhost:3001/commentaires/${commentId}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then(() => {
            console.log("Delete comment successful");
            //window.location.href = '/';
            setRenderCounter((old) => old + 1);
            setContent("");
          })
          .catch((error) => {
            console.error("Delete comment error:", error);
          });
      }
    }
  };

  return (
    <div>
      <section id="blog-h" className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              Welcome to Blog<span className="text-blue font-bold">Yoo!!</span>
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Fell!! Read!! Write!! Share!! blogs. Yes, here you can fell free
              to write and read your <b>Blogs</b> when & where you want and
              share yours <b>Ideas</b> with others.
            </p>
            <a
              href="#our-blogs"
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Discover
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  transform="rotate(90 10 10)"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="http://localhost:3001/images/blog.jpg" alt="mockup" />
          </div>
        </div>
      </section>

      <h1
        id="our-blogs"
        className="text-left ml-16 mt-3 mt-8 text-3xl font-bold"
      >
        <span className="border-b-4 border-blue-500">Our Blogs</span>
      </h1>

      <div className="flex justify-evenly	 p-8">
        <div className="flex flex-wrap gap-8 w-4/6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="max-w-4xl p-4 bg-white shadow-lg rounded-lg w-full"
            >
              <div className="flex items-center">
                <div className="w-55 h-55 mr-5">
                  {article.image && (
                    <img
                      src={article.image + "?random=" + article.id}
                      alt="Article"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    <i className="fas fa-user-circle text-gray-600 mr-2"></i>
                    {article.author.name}{" "}
                    <span className="text-black text-xs">
                      (created at: {article.createdAt.split("T")[0]},{" "}
                      {article.createdAt.split("T")[1].split(":")[0]}:
                      {article.createdAt.split("T")[1].split(":")[1]})
                    </span>
                  </h5>
                  <div className="flex flex-row">
                    {article.categories.map((categorie) => (
                      <button
                        key={categorie.id}
                        className="rounded-full bg-sky-50 mb-2 p-1 mx-1 border-solid border-2 border-blue-400"
                      >
                        <Link to={`/categories/${categorie.id}`}>
                          {categorie.name}
                        </Link>
                      </button>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold mb-2">{article.title}</h2>
                  <p className="text-gray-700 text-justify">
                    {article.content}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold mb-2">
                  <span className="border-b-4 border-blue-500">Comments</span>
                </p>
                <form
                  className="mb-3"
                  onSubmit={(e) => handleSubmit(e, article.id, user.email)}
                >
                  <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="comment"
                      rows="2"
                      onChange={handleContentChange}
                      value={content}
                      className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                      placeholder="Write a comment..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                  >
                    Post comment
                  </button>
                </form>
                <div className="max-h-60 overflow-y-auto pl-4 scrollbar">
                  {article.comments
                    .sort((a, b) => b.id - a.id)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="mt-2 border-t border-gray-300"
                      >
                        <h5 className="text-gray-800">
                          <i className="fas fa-user-circle text-gray-600 mr-2"></i>
                          <b>{comment.email.split("@")[0]}</b>
                        </h5>
                        <p className="text-gray-500 ml-5 flex justify-between">
                          {comment.content}
                          {user && comment.email === user.email && (
                            <div className="flex justify-end mt-2">
                              {editingCommentId === comment.id ? (
                                <React.Fragment>
                                  <textarea
                                    rows="2"
                                    value={updatedContent}
                                    onChange={handleUpdatedContentChange}
                                    className="px-2 py-1 border border-gray-300 rounded-md mx-2"
                                  ></textarea>
                                  <button
                                    className="text-blue-500 ml-2 mx-2 rounded-md border border-blue-500 p-2"
                                    onClick={() =>
                                      handleUpdate(comment.id, updatedContent)
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="text-red-500 ml-2 mx-2 rounded-md border border-red-500 p-1"
                                    onClick={() => handleDelete(comment.id)}
                                  >
                                    Delete
                                  </button>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <button
                                    className="text-blue-500 mr-2 mx-2 rounded-md border border-blue-500 p-1"
                                    onClick={() =>
                                      handleEditComment(comment.id)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="text-red-500 mx-2 rounded-md border border-red-500 p-1"
                                    onClick={() => handleDelete(comment.id)}
                                  >
                                    Delete
                                  </button>
                                </React.Fragment>
                              )}
                            </div>
                          )}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-1/4">
          <Categories />
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:3001/auth/register", userData)
      .then((response) => {
        console.log("Registration successful:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/profile";
      })
      .catch((error) => {
        console.error("Registration error:", error);
      });
  };

  return (
    <div>
      <h1 className="text-center mb-8 text-3xl font-bold"><span className="border-b-4 border-blue-500">Register</span></h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:3001/auth/login", userData)
      .then((response) => {
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/profile";
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <div>
      <h1 className="text-center mb-8 text-3xl font-bold"><span className="border-b-4 border-blue-500">Login</span></h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

const Profile = () => {
  const [articles, setArticles] = useState([]);
  const [content, setContent] = useState("");
  const [renderCounter, setRenderCounter] = useState(0);
  const [updatedContent, setUpdatedContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const [title, setTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          "http://localhost:3001/users/" + user.id,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching user articles:", error);
      }
    };

    fetchUserArticles();
    fetchCategories();
  }, [renderCounter]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/categories");
      setAvailableCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (articles.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleArticleContentChange = (e) => {
    setArticleContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      setCategories([...categories, categoryId]);
    } else {
      setCategories(categories.filter((id) => id !== categoryId));
    }
  };

  const handleCommentContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleUpdatedContentChange = (e) => {
    setUpdatedContent(e.target.value);
  };

  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId);
  };

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const nameUser = user.name;
  const emailUser = user.email;

  const handleSubmitComment = async (e, articleId, email) => {
    e.preventDefault();

    const commentData = {
      email: email,
      content: content,
      articleId: articleId,
    };

    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .post("http://localhost:3001/commentaires", commentData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then(() => {
          console.log("Creation comment successful:");
          //window.location.href = '/';
          setRenderCounter((old) => old + 1);
          setContent("");
        })
        .catch((error) => {
          console.error("Creation comment error:", error);
        });
    }
  };

  const handleSubmitArticle = async (e, author) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", articleContent);
    formData.append("image", selectedImage);
    formData.append("author", author);
    formData.append("published", true);
    for (const categoryId of categories) {
      formData.append("categories[]", categoryId);
    }

    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .post("http://localhost:3001/articles", formData, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          console.log("Creation article successful:");
          setRenderCounter((old) => old + 1);
          setTitle("");
          setArticleContent("");
          window.scrollTo(0, 0);
          setRefresh(false);
          setTimeout(() => {
            setRefresh(true);
          }, 0);
        })
        .catch((error) => {
          console.error("Creation article error:", error);
        });
    }
  };

  const handleUpdateComment = async (commentId, updatedContent) => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .patch(
          `http://localhost:3001/commentaires/${commentId}`,
          { content: updatedContent },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then(() => {
          console.log("Update comment successful");
          setRenderCounter((old) => old + 1);
          setContent("");
          setEditingCommentId(null);
        })
        .catch((error) => {
          console.error("Update comment error:", error);
        });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      window.location.href = "/login";
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
      );
      if (confirmed) {
        axios
          .delete(`http://localhost:3001/commentaires/${commentId}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then(() => {
            console.log("Delete comment successful");
            setRenderCounter((old) => old + 1);
            setContent("");
          })
          .catch((error) => {
            console.error("Delete comment error:", error);
          });
      }
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!token) {
      window.location.href = "/login";
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to delete this article?"
      );
      if (confirmed) {
        axios
          .delete(`http://localhost:3001/articles/${articleId}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then(() => {
            console.log("Delete article successful");
            setRenderCounter((old) => old + 1);
          })
          .catch((error) => {
            console.error("Delete article error:", error);
          });
      }
    }
  };

  return (
    <div>
      <h1 className="text-center m-8 text-3xl font-bold">
        Welcome to Your Profile <span className="border-b-4 border-blue-500">{nameUser}</span>
      </h1>

      <div className="flex items-center w-full justify-center">
        <div className="w-full">
            <div className="bg-white shadow-xl rounded-lg py-6">
            <div className="photo-wrapper p-2">
                <img className="w-32 h-32 rounded-full mx-auto" src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png" alt="John Doe" />
            </div>
                <div className="p-2 flex flex-col items-center">
                    <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{nameUser}</h3>
                    <div className="text-center text-gray-400 text-xs font-semibold">
                        <p>AUTHOR</p>
                    </div>
                    <table className="text-xs my-3">
                        <tbody>
                        <tr>
                            <td className="px-2 py-2 text-lg"><b>{emailUser}</b></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      <h1 className="text-left ml-16 mt-3 mt-8 text-3xl font-bold">
        <span className="border-b-4 border-blue-500">Your Blogs</span>
      </h1>

      <div className="flex justify-evenly	p-8 items-start">
        <div className="flex flex-wrap gap-8 w-4/6">
          {articles.articles.map((article) => (
            <div
              key={article.id}
              className="max-w-4xl p-4 bg-white shadow-lg rounded-lg w-full"
            >
              <div className="flex items-center">
                <div className="w-55 h-55 w-2/6 mr-5">
                  {article.image && (
                    <img
                      src={article.image + "?random=" + article.id}
                      alt="Article"
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex flex-col w-3/5">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    <i className="fas fa-user-circle text-gray-600 mr-2"></i>
                    {article.author.name}{" "}
                    <span className="text-black text-xs">
                      (created at: {article.createdAt.split("T")[0]},{" "}
                      {article.createdAt.split("T")[1].split(":")[0]}:
                      {article.createdAt.split("T")[1].split(":")[1]})
                    </span>
                    <button
                      className="text-red-500 ml-2 mx-2 rounded-md border border-red-500 p-1 ml-10"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      {" "}
                      Delete{" "}
                    </button>
                    <button className="text-blue-500 mr-2 mx-2 rounded-md border border-blue-500 p-1">
                      {" "}
                      Edit{" "}
                    </button>
                  </h5>
                  <div className="flex flex-row">
                    {article.categories.map((categorie) => (
                      <button
                        key={categorie.id}
                        className="rounded-full bg-sky-50 mb-2 p-1 mx-1 border-solid border-2 border-blue-400"
                      >
                        <Link to={`/categories/${categorie.id}`}>
                          {categorie.name}
                        </Link>
                      </button>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold mb-2">{article.title}</h2>
                  <p className="text-gray-700 text-justify">
                    {article.content}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold mb-2">
                  <span className="border-b-4 border-blue-500">Comments</span>
                </p>
                <form
                  className="mb-3"
                  onSubmit={(e) =>
                    handleSubmitComment(e, article.id, user.email)
                  }
                >
                  <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor="comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="comment"
                      rows="2"
                      onChange={handleCommentContentChange}
                      value={content}
                      className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                      placeholder="Write a comment..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                  >
                    Post comment
                  </button>
                </form>
                <div className="max-h-60 overflow-y-auto pl-4 scrollbar">
                  {article.comments
                    .sort((a, b) => b.id - a.id)
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="mt-2 border-t border-gray-300"
                      >
                        <h5 className="text-gray-800">
                          <i className="fas fa-user-circle text-gray-600 mr-2"></i>
                          <b>{comment.email.split("@")[0]}</b>
                        </h5>
                        <p className="text-gray-500 ml-5 flex justify-between">
                          {comment.content}
                          {user && comment.email === user.email && (
                            <div className="flex justify-end mt-2">
                              {editingCommentId === comment.id ? (
                                <React.Fragment>
                                  <textarea
                                    rows="2"
                                    value={updatedContent}
                                    onChange={handleUpdatedContentChange}
                                    className="px-2 py-1 border border-gray-300 rounded-md mx-2"
                                  ></textarea>
                                  <button
                                    className="text-blue-500 ml-2 mx-2 rounded-md border border-blue-500 p-2"
                                    onClick={() =>
                                      handleUpdateComment(
                                        comment.id,
                                        updatedContent
                                      )
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="text-red-500 ml-2 mx-2 rounded-md border border-red-500 p-1"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <button
                                    className="text-blue-500 mr-2 mx-2 rounded-md border border-blue-500 p-1"
                                    onClick={() =>
                                      handleEditComment(comment.id)
                                    }
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="text-red-500 mx-2 rounded-md border border-red-500 p-1"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </React.Fragment>
                              )}
                            </div>
                          )}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-1/4 flex flex-col gap-8">
          <div className="w-full">
            <Categories />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 w-full">
            <h1 className="text-center mb-8 text-3xl font-bold">
              <span className="border-b-4 border-blue-500">Write a Blog</span>
            </h1>
            {refresh && (
              <form
                onSubmit={(e) => handleSubmitArticle(e, user.id)}
                className="max-w-md mx-auto"
              >
                <div className="mb-4">
                  <label className="block mb-1">Title:</label>
                  <input
                    type="text"
                    onChange={handleTitleChange}
                    value={title}
                    required
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Your content</label>
                  <textarea
                    rows="2"
                    onChange={handleArticleContentChange}
                    value={articleContent}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder="Write your content..."
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Uplode image:</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    required
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label>
                    Choose Category:
                    {availableCategories.map((category) => (
                      <div key={category.id}>
                        <input
                          type="checkbox"
                          value={category.id}
                          onChange={handleCategoryChange}
                          className="mx-4"
                        />
                        {category.name}
                      </div>
                    ))}
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Published:</label>
                  <input
                    type="radio"
                    name="published"
                    className="mx-3"
                    required
                  />
                  Yes
                  <input
                    type="radio"
                    name="published"
                    className="ml-10 mr-3"
                    required
                  />
                  No
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Post Blog
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("token") !== null);
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="bg-neutral-50">
        <header className="bg-blue-500 py-4">
          <nav className="container mx-auto flex items-center justify-between">
            <Link to="/" className="text-white font-bold text-lg">
              BlogYoo!!
            </Link>
            <ul className="flex items-center">
              <li className="ml-4">
                <Link to="/" className="text-white hover:text-blue-200">
                  Home
                </Link>
              </li>
              <li className="ml-4">
                <Link
                  to="/categories"
                  className="text-white hover:text-blue-200"
                >
                  Categories
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="ml-4">
                    <Link
                      to="/profile"
                      className="text-white hover:text-blue-200"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="ml-4">
                    <button
                      onClick={Logout}
                      className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="ml-4">
                    <Link
                      to="/register"
                      className="text-white hover:text-blue-200"
                    >
                      Register
                    </Link>
                  </li>
                  <li className="ml-4">
                    <Link
                      to="/login"
                      className="text-white hover:text-blue-200"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/categories" element={<Categories />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route
            exact
            path="/categories/:categoryId"
            element={<CategoryPage />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;