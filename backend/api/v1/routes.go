package v1

import (
	"wdb/internal/handler"
	"wdb/internal/repository"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.RouterGroup, repo *repository.Repository) {
	v1 := r.Group("/v1")
	{
		h := handler.NewHandler(repo)
		v1.GET("/hello", h.HelloWorld)
		v1.GET("/users/:id", h.GetUser)
		v1.POST("/users", h.CreateUser)
	}
}
