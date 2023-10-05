# Introduction

wdb (pronounced /ˈwɔːdrəʊb/, or roughly waw·drowb) makes sense of your wardrobe. Never have "what should I wear today" anxiety again!

- 🧦 Index your clothing
- 💡 Generate new fits daily and on-the-fly
- 📤 Share and collaborate with friends
- 🎊 Make sense of your wardrobe

# Directory structure

go-rest-api/
├── cmd/
│ └── main.go # Application entry point
├── internal/ # Internal packages
│ ├── handler/
│ │ └── handler.go # Request handlers
│ ├── repository/
│ │ └── repository.go # Data access layer
│ └── router/
│ └── router.go # Router setup
├── pkg/ # Reusable packages
├── api/
│ └── v1/
│ └── routes.go # API routes
├── config/
│ └── config.go # Configuration setup
├── models/
│ └── models.go # Data models
├── main.go # Main application entry point
└── go.mod
