require "smalruby"
require "./bomber/character.rb"

Dir[File.expand_path('../bomber', __FILE__) << '/*.rb'].each do |file|
  require file
end

module Bomber
  BLOCK = 32
  def block(num)
    BLOCK * num
  end

  def other_char
    $all_obj.flatten - [self]
  end

  def hit_char
    $hit_obj.flatten - [self]
  end

  def all_enemy
    $enemy.flatten - [self]
  end

  def current_block
    [current_x_block, current_y_block]
  end

  def current_x_block
    self.x / BLOCK
  end

  def current_y_block
    self.y / BLOCK
  end

  def clicked_block
    [clicked_x_block, clicked_y_block]
  end

  def clicked_x_block
    Input.mouse_pos_x / BLOCK
  end

  def clicked_y_block
    Input.mouse_pos_y / BLOCK
  end

  def current_half?
    current_x_half? or current_y_half?
  end

  def current_x_half?
    !(self.x % BLOCK == 0)
  end

  def current_y_half?
    !(self.y % BLOCK == 0)
  end

  def char_exists?(x, y)
    !!current_char(x, y)
  end

  def next_char(x, y)
    chars = other_char - $blocks
    tgt = nil
    chars.flatten.each do |char|
      if char.current_block == [x, y]
        if char.class == Bomber::Door && !char.close
          tgt = char
          next
        end
        return char
      end
    end
    return tgt
  end

  def enemy_count(enemy_class=Bomber::EnemyNormal)
    count = 0
    $enemy.each{|ene| count += 1 if ene.class == enemy_class}
    return count
  end

  def normal_enemy_count
    return enemy_count(Bomber::EnemyNormal)
  end

  def trace_enemy_count
    return enemy_count(Bomber::EnemyTrace)
  end
end