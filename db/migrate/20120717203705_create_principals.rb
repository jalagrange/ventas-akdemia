class CreatePrincipals < ActiveRecord::Migration
  def change
    create_table :principals do |t|
      t.string :name
      t.string :phone
      t.string :email
      t.integer :school_id

      t.timestamps
    end
  end
end
