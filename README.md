# JSON Sorter

A powerful web-based tool for formatting and sorting JSON objects with support for complex nested structures, arrays, and Flutter ARB localization files.

## 🚀 Features

- **Flexible Sorting**: Sort JSON objects in ascending or descending order
- **Nested Object Support**: Handles deeply nested JSON structures with ease
- **Array Sorting**: Optional sorting of plain arrays and arrays of objects
- **ARB File Support**: Special handling for Flutter Application Resource Bundle (ARB) files with preserved metadata
- **Customizable Indentation**: Choose between spaces or tabs for formatted output
- **Dark/Light Theme**: Toggle between light and dark modes for comfortable viewing
- **User-Friendly Interface**: Clean, responsive design built with Tailwind CSS
- **Client-Side Processing**: Secure JSON processing without storing your data
- **Copy to Clipboard**: Easily copy sorted JSON with a single click

## 🖥️ Demo

Access the live demo at: [https://dcpdev.es/json-sorter](https://dcpdev.es/json-sorter)

## 📋 Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/diegodcp/json-sorter.git
cd json-sorter
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Usage

### Development Mode

Start the server with auto-reload:
```bash
npm run dev
```

### Production Mode

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:5005`

### Running Tests

Execute the test suite:
```bash
npm test
```

## 🎯 How It Works

### Sorting Options

1. **Order**: Choose between ascending (A-Z) or descending (Z-A) key sorting
2. **Plain Arrays**: Enable to sort primitive array values (numbers, strings)
3. **Tabs Indentation**: Switch between 2-space or tab indentation
4. **ARB File**: Enable special handling for Flutter ARB localization files

### API Endpoint

The application exposes a REST API endpoint for sorting JSON:

**POST** `/sort`

Request body:
```json
{
  "json": { /* your JSON object */ },
  "order": "asc",
  "plainArrays": true,
  "indentation": "spaces",
  "arbSupport": false
}
```

Response: Sorted JSON object

### ARB File Support

When ARB support is enabled, the tool:
- Preserves the `@@locale` key position based on sort order
- Keeps translation metadata (`@key` entries) adjacent to their corresponding translation keys
- Maintains ARB file structure integrity

## 📁 Project Structure

```
json-sorter/
├── public/              # Frontend assets
│   ├── index.html      # Main HTML file
│   ├── css/
│   │   └── styles.css  # Custom styles
│   └── js/
│       └── script.js   # Client-side JavaScript
├── src/
│   ├── index.js        # Express server and sorting logic
│   └── tests.js        # Test suite
├── package.json
├── LICENSE
└── README.md
```

## 🧪 Testing

The project includes comprehensive tests covering:
- Basic JSON object sorting (ascending/descending)
- Nested object sorting
- Plain array sorting (enabled/disabled)
- ARB file support (ascending/descending)
- Complex nested structures

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Testing**: Mocha, Node.js Assert
- **Development**: Nodemon

## 📝 Example

Input JSON:
```json
{
  "zebra": "animal",
  "apple": "fruit",
  "car": "vehicle",
  "nested": {
    "z": 1,
    "a": 2
  }
}
```

Output (Ascending):
```json
{
  "apple": "fruit",
  "car": "vehicle",
  "nested": {
    "a": 2,
    "z": 1
  },
  "zebra": "animal"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Diego**

- Website: [dcpdev.es](https://dcpdev.es)

## ☕ Support

If you find this tool helpful, consider [buying me a coffee](https://buymeacoffee.com/dcplab)!

## 🐛 Bug Reports

If you discover any bugs, please create an issue on GitHub with detailed information about the problem.

## 📌 Roadmap

- [ ] Support for YAML formatting
- [ ] Batch file processing
- [ ] Custom sorting rules
- [ ] Export/Import configurations
- [ ] CLI version

---

