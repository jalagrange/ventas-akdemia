class CreateSchoolSystems < ActiveRecord::Migration
  def change
    create_table :school_systems do |t|
      t.string :name

      t.timestamps
    end
  end
end
