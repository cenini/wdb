package router

import (
	"wdb/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Define routes
	r.GET("/hello", handler.HelloWorld)

	return r
}

func Run() {
	r := SetupRouter()
	r.Run(":8080")
}
