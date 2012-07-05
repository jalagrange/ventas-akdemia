class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string :name
      t.string :city
      t.string :state
      t.string :phone
      t.string :email
      t.text :address
      t.text :note

      t.timestamps
    end
  end
end
