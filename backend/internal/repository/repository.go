package repository

import (
	"wdb/models"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) GetUsers(c *gin.Context) ([]models.User, error) {
	var users []models.User
	_, err := r.db.NewSelect().Model(&users).Exec(c)
	if err != nil {
		return users, err
	}
	return users, nil
}

func (r *Repository) CreateUser(user models.User, c *gin.Context) (models.User, error) {
	res, err := r.db.NewInsert().Model(&user).Exec(c)
	if err != nil {
		return user, err
	}
	oid, err := res.LastInsertId()
	if err != nil {
		return user, err
	}
	var createdUser models.User
	err = r.db.NewSelect().Model(createdUser).Where("oid = ?", oid).Scan(c)
	if err != nil {
		return user, err
	}
	return createdUser, nil
}

func (r *Repository) DeleteUser() {

}

func (r *Repository) CreateItem() {

}

func (r *Repository) UpdateItem() {

}

func (r *Repository) DeleteItem() {

}

func (r *Repository) CreatePhoto() {

}

func (r *Repository) UpdatePhoto() {

}

func (r *Repository) DeletePhoto() {

}
