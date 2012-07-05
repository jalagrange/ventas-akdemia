class CreateSchoolTypes < ActiveRecord::Migration
  def change
    create_table :school_types do |t|
      t.integer :school_id
      t.integer :school_group_id

      t.timestamps
    end
  end
end
