package repository

import (
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

func (r *Repository) CreateUser() {

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
