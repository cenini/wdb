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
	}
}
