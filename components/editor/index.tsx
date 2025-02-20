import React, { useState, useEffect } from "react";
import {
  EditorProvider,
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  Separator,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  ContentEditableEvent,
} from "react-simple-wysiwyg";
import { Label } from "../ui/label";

// Helper function to ensure string values
const ensureString = (value: any): string => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
};

const RichTextEditor = (props: {
  jobTitle: string | null;
  initialValue: string;
  onEditorChange: (value: string) => void;
}) => {
  const { jobTitle, initialValue, onEditorChange } = props;
  
  const [safeValue, setSafeValue] = useState("");
  
  useEffect(() => {
    setSafeValue(ensureString(initialValue));
  }, [initialValue]);

  const handleEditorChange = (event: ContentEditableEvent) => {
    const newValue = ensureString(event.target.value);
    setSafeValue(newValue);
    onEditorChange(newValue);
  };

  return (
    <div>
      <div className="my-2">
        <Label>Work Summary</Label>
      </div>

      <EditorProvider>
        <Editor
          value={safeValue}
          containerProps={{
            style: {
              resize: "vertical",
              lineHeight: 1.2,
              fontSize: "13.5px",
            },
          }}
          onChange={handleEditorChange}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;