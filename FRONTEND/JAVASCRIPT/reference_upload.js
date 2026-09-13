document.addEventListener("DOMContentLoaded", function () {

    const uploadButton = document.getElementById("uploadReferenceBtn");

    if (!uploadButton) {
        console.error("Upload button not found");
        return;
    }

    uploadButton.addEventListener("click", async function () {

        const studentId = document.getElementById("student_id").value.trim();
        const studentName = document.getElementById("student_name").value.trim();
        const fileInput = document.getElementById("reference_pdf");

        if (!studentId) {
            alert("Please enter Student ID.");
            return;
        }

        if (!studentName) {
            alert("Please enter Student Name.");
            return;
        }

        if (!fileInput.files.length) {
            alert("Please select a reference PDF.");
            return;
        }

        const file = fileInput.files[0];

        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }

        const formData = new FormData();

        formData.append("student_id", studentId);
        formData.append("student_name", studentName);
        formData.append("file", file);

        uploadButton.disabled = true;
        uploadButton.textContent = "Uploading...";

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/upload_reference",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();

            console.log("Server response:", result);

            if (response.ok && result.status === "success") {

                alert(
                    "Reference PDF uploaded successfully!\n\n" +
                    "Student ID: " + result.student + "\n" +
                    "PDF: " + result.pdf
                );

                fileInput.value = "";

            } else {

                alert(
                    "Upload failed.\n\n" +
                    (result.error || result.message || "Unknown error")
                );
            }

        } catch (error) {

            console.error("Upload error:", error);

            alert(
                "Cannot connect to the Flask backend.\n\n" +
                "Make sure Flask is running on port 5000."
            );

        } finally {

            uploadButton.disabled = false;
            uploadButton.textContent = "Upload Reference PDF";
        }
    });
});