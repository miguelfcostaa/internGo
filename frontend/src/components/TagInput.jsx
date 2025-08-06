import React, { useState } from "react";
import { Form, Badge } from "react-bootstrap";
import styles from "../styles/TagInput.module.css"; 

const TagInput = ({ value = [], onChange, placeholder }) => {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			const trimmed = inputValue.trim();
			if (trimmed && !value.includes(trimmed)) {
				onChange([...value, trimmed]);
			}
			setInputValue("");
		}
	};

	const handleRemove = (tagToRemove) => {
		onChange(value.filter((tag) => tag !== tagToRemove));
	};

	return (
		<div className={styles.tagInputContainer}>
			<Form.Control
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={() => {
					const trimmed = inputValue.trim();
					if (trimmed && !value.includes(trimmed)) {
						onChange([...value, trimmed]);
						setInputValue("");
					}
				}}
				placeholder={placeholder}
				className={styles.input}
			/>
			{value.length > 0 && (
				<div className={styles.tags}>
					{value.map((tag, index) => (
						<Badge
								key={index}
								className={styles.tag}
							onClick={() => handleRemove(tag)}
						>
							<span style={{ marginRight: "4px" }}>{tag}</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
								<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
							</svg>
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};

export default TagInput;
