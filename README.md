# 🧰 PDF Toolkit API

A simple, open-source PDF toolkit API for developers. Designed for ease of use, extensibility, and no vendor lock-in.

## ✨ Features (Planned)

- ✅ Merge PDFs (Available)
- 🔜 Image to PDF
- 🔜 PDF to Image
- 🔜 Sign PDF
- 🔜 Fill PDF Form

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/pdf-toolkit-api.git
cd pdf-toolkit-api
yarn install
```

Start the development server:

```bash
yarn start:dev
```

## 📦 API Endpoints

### `POST /merge-pdf`

Merge multiple PDF files into a single PDF in the specified order.

#### Request

- `Content-Type: multipart/form-data`
- Body fields:
  - `files`: PDF files (can upload multiple)
  - `order`: JSON array of string representing the desired merge order by the files names (e.g. `[file2.pdf, file1.pdf, file3.pdf]` for third, first, then second PDF to be merged in order)

#### Example `curl` request

```bash
curl --location 'http://localhost:9999/merge-pdf' \
--form 'pdfs=@"/C:/Users/ThinkPad/Downloads/Resume Tata - March 2025-compressed.pdf"' \
--form 'pdfs=@"/C:/Users/ThinkPad/Downloads/processed.pdf"' \
--form 'pdfs=@"/C:/Users/ThinkPad/Downloads/Profile.pdf"' \
--form 'order="[
    \"processed.pdf\",
    \"Resume Tata - March 2025-compressed.pdf\",
    \"Profile.pdf\"
]"'
```

#### Response

- Returns the merged PDF file as a downloadable stream.

## 🛠 Tech Stack

- Node.js
- Express
- PDF-lib (or your chosen PDF processing library)

## 📚 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for:

- New features
- Bug fixes
- Docs improvements

## 📝 License

MIT License. Feel free to use it in personal and commercial projects.

---

### 📌 Roadmap

- [ ] Add support for image-to-PDF
- [ ] Add PDF-to-image export
- [ ] Add PDF signature functionality
- [ ] Add form-filling support

Stay tuned for updates!
