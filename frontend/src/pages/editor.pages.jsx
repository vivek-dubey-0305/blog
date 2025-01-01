import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import Loader from "../components/loader.component";
import axios from "axios";
import PageNotFound from "./404.page";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

//*blogContext for making the state of all listed aboove
export const EditorContext = createContext({});

const Editor = () => {
  // *USEPRARAMS
  let { blog_id } = useParams();

  //*Editor state....for BLogEditor and PublishForm
  const [editorState, setEditorState] = useState("editor");

  //?Moving from one page to other will lost it, it won't track that is why
  //* textEditor State ..in order to track the state
  const [textEditor, setTextEditor] = useState({ isReady: false });

  //*BLOG STATE
  const [blog, setBlog] = useState(blogStructure);

  // *Loading STATE
  const [loading, setLoading] = useState(true);

  //*USER AUTH STATE from userContext
  let {
    userAuth: { access_token, isAdmin },
  } = useContext(UserContext);

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        setBlog(null);
        setLoading(false);
      });
  }, []);

  //*------------------------------
  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {!isAdmin ? (
        <Navigate to="/404" />
      ) : access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
