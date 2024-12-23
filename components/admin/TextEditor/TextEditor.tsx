"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import {
  MdOutlineFormatBold,
  MdOutlineFormatItalic,
  MdOutlineFormatQuote,
  MdOutlineFormatStrikethrough,
  MdOutlineFormatUnderlined,
  MdOutlineImage,
  MdOutlineLink,
} from "react-icons/md";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  insertNodes,
  Transforms,
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import styles from "./TextEditor.module.css";
import Button from "../Button/Button";
import { IoMdCloudUpload } from "react-icons/io";

type CustomElement =
  | { type: "paragraph"; children: CustomText[] }
  | { type: "quote"; children: CustomText[] }
  | { type: "list-item"; children: CustomText[] }
  | { type: "ordered-list"; children: CustomElement[] }
  | { type: "unordered-list"; children: CustomElement[] }
  | { type: "image"; children: CustomText[]; src?: string };

type CustomMark = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  link?: boolean;
};

type CustomText = { text: string } & CustomMark;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

function htmlToSlate(html: string) {
  const parser = new DOMParser();
  const { body } = parser.parseFromString(html, "text/html");

  const getElementType = (element: HTMLElement): CustomElement["type"] => {
    switch (element.tagName.toLowerCase()) {
      case "p":
        return "paragraph";
      case "blockquote":
        return "quote";
      case "ol":
        return "ordered-list";
      case "ul":
        return "unordered-list";
      case "li":
        return "list-item";
      case "img":
        return "image";
      default:
        return "paragraph";
    }
  };

  const traverse = (node: Node): Descendant[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      return [{ text: node.textContent || "" }];
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const type = getElementType(element);
      let children = Array.from(node.childNodes).flatMap(traverse);

      if (type === "image") {
        return [
          {
            type,
            children: [{ text: "" }],
            src: element.getAttribute("src") || undefined,
          },
        ];
      }

      return [{ type, children } as CustomElement];
    }

    return [];
  };

  return Array.from(body.childNodes).flatMap(traverse);
}

function slateToHTML(value: Descendant[]) {
  const serialize = (node: Descendant): string => {
    if ("text" in node) {
      let text = node.text;

      if (node.bold) text = `<b>${text}</b>`;
      if (node.italic) text = `<i>${text}</i>`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.strikethrough) text = `<s>${text}</s>`;
      if (node.link) text = `<a href="${node.text}">${text}</a>`;

      return text;
    }

    const children = node.children.map(serialize).join("");

    switch (node.type) {
      case "paragraph":
        return `<p>${children}</p>`;
      case "quote":
        return `<blockquote>${children}</blockquote>`;
      case "ordered-list":
        return `<ol>${children}</ol>`;
      case "unordered-list":
        return `<ul>${children}</ul>`;
      case "list-item":
        return `<li>${children}</li>`;
      case "image":
        return `<img src="${node.src}" />`;
    }
  };

  return value.map(serialize).join("");
}

export interface TextEditorRef {
  getValueHTML: () => string;
}

interface TextEditorProps {
  placeholder: string;
  initialValue?: string;
}

const TextEditor = forwardRef<TextEditorRef, TextEditorProps>((props, ref) => {
  const { placeholder, initialValue } = props;

  const [value, setValue] = useState<Descendant[]>(
    htmlToSlate(initialValue || "<p></p>")
  );
  const [image, setImage] = useState<string>("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState<boolean>(false);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const imagePopupRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    getValueHTML: () => slateToHTML(value),
  }));

  const isMarkActive = (editor: Editor, format: keyof CustomMark) => {
    return Editor.marks(editor)?.[format];
  };

  const toggleMark = (editor: Editor, format: keyof CustomMark) => {
    const isActive = isMarkActive(editor, format);
    Editor.addMark(editor, format, !isActive);
  };

  const isBlockActive = (editor: Editor, format: CustomElement["type"]) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => "type" in n && n.type === format,
    });

    return !!match;
  };

  const toggleBlock = (editor: Editor, format: CustomElement["type"]) => {
    const isActive = isBlockActive(editor, format);
    const isList = format === "ordered-list" || format === "unordered-list";

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        "type" in n &&
        (n.type === "ordered-list" || n.type === "unordered-list"),
      split: true,
    });

    const newProperties: Partial<CustomElement> = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;

    switch (element.type) {
      case "quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "ordered-list":
        return <ol {...attributes}>{children}</ol>;
      case "unordered-list":
        return <ul {...attributes}>{children}</ul>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "image":
        return <img src={element.src} {...attributes} />;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const { attributes, children, leaf } = props;

    let formattedChildren = children;

    if (leaf.bold) formattedChildren = <b>{formattedChildren}</b>;
    if (leaf.italic) formattedChildren = <i>{formattedChildren}</i>;
    if (leaf.underline) formattedChildren = <u>{formattedChildren}</u>;
    if (leaf.strikethrough) formattedChildren = <s>{formattedChildren}</s>;
    if (leaf.link)
      formattedChildren = <a href={leaf.text}>{formattedChildren}</a>;

    return <span {...attributes}>{formattedChildren}</span>;
  }, []);

  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.ctrlKey && e.key === "b") toggleMark(editor, "bold");

    if (e.ctrlKey && e.key === "i") toggleMark(editor, "italic");

    if (e.ctrlKey && e.key === "u") toggleMark(editor, "underline");

    if (e.ctrlKey && e.altKey && e.key === "s")
      toggleMark(editor, "strikethrough");

    if (e.ctrlKey && e.altKey && e.key === "l") toggleMark(editor, "link");

    if (e.ctrlKey && e.altKey && e.key == "i") setIsImagePopupOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const closeImagePopup = () => {
    setIsImagePopupOpen(false);
    setImage("");
  };

  const insertImage = () => {
    if (!image) return window.alert("Nenhuma imagem foi enviada.");

    insertNodes(editor, [
      {
        type: "image",
        src: image,
        children: [{ text: "" }],
      },
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ]);
  };

  const handleEnterKeyInImagePopup = (e: KeyboardEvent) => {
    if (imagePopupRef.current && e.key === "Enter") {
      insertImage();
      closeImagePopup();
    }
  };

  const handleEscapeImagePopup = (e: KeyboardEvent) => {
    if (imagePopupRef.current && e.key === "Escape") closeImagePopup();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    document.addEventListener("keydown", handleEnterKeyInImagePopup);
    document.addEventListener("keydown", handleEscapeImagePopup);

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
      document.removeEventListener("keydown", handleEnterKeyInImagePopup);
      document.removeEventListener("keydown", handleEscapeImagePopup);
    };
  }, []);

  return (
    <>
      <div className={styles.editorContainer}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <div className={styles.toolbar}>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "bold");
              }}
              title="Negrito (Ctrl+B)"
              className={isMarkActive(editor, "bold") ? styles.active : ""}
            >
              <MdOutlineFormatBold size={25} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "italic");
              }}
              title="Itálico (Ctrl+I)"
              className={isMarkActive(editor, "italic") ? styles.active : ""}
            >
              <MdOutlineFormatItalic size={25} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "underline");
              }}
              title="Sublinhado (Ctrl+U)"
              className={isMarkActive(editor, "underline") ? styles.active : ""}
            >
              <MdOutlineFormatUnderlined size={25} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "strikethrough");
              }}
              title="Tachado (Ctrl+Alt+S)"
              className={
                isMarkActive(editor, "strikethrough") ? styles.active : ""
              }
            >
              <MdOutlineFormatStrikethrough size={25} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock(editor, "quote");
              }}
              title="Citação"
              className={isBlockActive(editor, "quote") ? styles.active : ""}
            >
              <MdOutlineFormatQuote size={25} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock(editor, "ordered-list");
              }}
              title="Lista numerada"
              className={
                isBlockActive(editor, "ordered-list") ? styles.active : ""
              }
            >
              <AiOutlineOrderedList size={20} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleBlock(editor, "unordered-list");
              }}
              title="Lista com marcadores"
              className={
                isBlockActive(editor, "unordered-list") ? styles.active : ""
              }
            >
              <AiOutlineUnorderedList size={20} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleMark(editor, "link");
              }}
              title="Link (Ctrl+Alt+L)"
              className={isMarkActive(editor, "link") ? styles.active : ""}
            >
              <MdOutlineLink size={25} />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setIsImagePopupOpen(true);
              }}
              title="Imagem (Ctrl+Alt+I)"
            >
              <MdOutlineImage size={25} />
            </button>
          </div>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            className={styles.editor}
          />
        </Slate>
      </div>
      {isImagePopupOpen && (
        <div className={styles.imagePopupBackground}>
          <div className={styles.imagePopup} ref={imagePopupRef}>
            {image ? (
              <img src={image} alt="Preview" />
            ) : (
              <>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  name="uploadImage"
                  id="uploadImage"
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="uploadImage"
                  className={styles.uploadImageLabel}
                >
                  <div className={styles.uploadImageDiv}>
                    <IoMdCloudUpload size={80} color="#fff" />
                    <p>Adicionar imagem</p>
                  </div>
                </label>
              </>
            )}
            <div className={styles.imagePopupSendButtonDiv}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  insertImage();
                  closeImagePopup();
                }}
              >
                Adicionar imagem
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default TextEditor;
