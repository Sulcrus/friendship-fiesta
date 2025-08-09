"use client";

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { Upload, X } from 'lucide-react';

const DropzoneContainer = styled.div<{ isDragActive: boolean; hasFile: boolean }>`
  border: 1px dashed ${props => props.isDragActive ? '#111827' : props.hasFile ? '#16a34a' : '#e5e7eb'};
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isDragActive ? '#f9fafb' : props.hasFile ? '#f0fdf4' : '#fafafa'};

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
`;

const UploadIcon = styled.div`
  color: #111827;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const UploadText = styled.p`
  color: #555;
  font-size: 0.95rem;
  margin-bottom: 5px;
`;

const UploadSubtext = styled.p`
  color: #888;
  font-size: 0.85rem;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  margin-top: 10px;
`;

const FileName = styled.span`
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
`;

const RemoveButton = styled.button`
  background: none;
  color: #b91c1c;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fee2e2;
  }
`;

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept: string;
  placeholder: string;
}

export default function FileUpload({ onFileSelect, accept, placeholder }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  const hasFile = acceptedFiles.length > 0;

  return (
    <div>
      <DropzoneContainer
        {...getRootProps()}
        isDragActive={isDragActive}
        hasFile={hasFile}
      >
        <input {...getInputProps()} />
        <UploadIcon>
          <Upload size={24} />
        </UploadIcon>
        <UploadText>
          {isDragActive
            ? 'Drop the file here...'
            : hasFile
            ? 'File selected! Click to change'
            : placeholder
          }
        </UploadText>
        <UploadSubtext>
          {hasFile ? 'or drag and drop a different file' : 'or drag and drop your file here'}
        </UploadSubtext>
      </DropzoneContainer>

      {hasFile && acceptedFiles[0] && (
        <FilePreview>
          <FileName>{acceptedFiles[0].name}</FileName>
          <RemoveButton onClick={removeFile} type="button">
            <X size={16} />
          </RemoveButton>
        </FilePreview>
      )}
    </div>
  );
}
