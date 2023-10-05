package v1

import (
	"wdb/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.RouterGroup) {
	v1 := r.Group("/v1")
	{
		v1.GET("/hello", handler.HelloWorld)
	}
}
