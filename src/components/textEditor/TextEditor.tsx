import React, { forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@mui/material/styles";

interface TextEditorProps {
    value: string;
    ref: any;
    onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = forwardRef(({ value, onChange }, ref) => {
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

    return (
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
                height: "200px",
            }}
        />
    );
});

export default TextEditor;
