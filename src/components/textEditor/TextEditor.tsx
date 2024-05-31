import React, { forwardRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
// import "./style.css";

interface TextEditorProps {
    value: string;
    ref: any;
    rating: number | null;
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = forwardRef(({ value, onChange, rating, setRating }, ref) => {
    const theme = useTheme();

    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "image",
        "video",
    ];

    useEffect(() => {
        const resizeImages = () => {
            //@ts-ignore
            const quillEditor = ref?.current?.getEditor?.();

            if (quillEditor) {
                const images = quillEditor.container.querySelectorAll("img");
                images.forEach((img: HTMLImageElement) => {
                    img.style.maxWidth = "50%";
                    img.style.maxHeight = "auto";
                });
            }
        };

        //@ts-ignore
        const editorInstance = ref?.current?.getEditor?.();

        if (editorInstance) {
            resizeImages();
            editorInstance.on("text-change", resizeImages);
        }

        return () => {
            if (editorInstance) {
                editorInstance.off("text-change", resizeImages);
            }
        };
    }, [ref, value]);

    return (
        <Box>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                // @ts-ignore
                ref={ref}
                style={{
                    backgroundColor:
                        theme.palette.mode === "dark" ? theme.palette.primary.main : "white",
                    color: theme.palette.mode === "dark" ? "white" : "black",
                    marginBottom: "10px",
                }}
                // className={theme.palette.mode === "dark" ? "dark-icons" : "light-icons"}
            />
            <Rating
                name="review-rating"
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue);
                }}
                max={10}
                precision={1}
            />
        </Box>
    );
});

export default TextEditor;
