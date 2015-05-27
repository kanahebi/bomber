module Bomber
  class Ono < Bomber::Character
    attr_accessor :guide, :agl
    def initialize(costume, x, y, angle)
      super
      @agl = :right
      @guide = Bomber::Guide.new(self)
      @guide.trace
    end

    def atack
      super
      if all_enemy.empty?
        sleep 1
        gameclear = Bomber::GameClear.new
        gameclear.z = 10
        sleep 3
        exit
      end
    end

    def move(move_angle=:right)
      if self.agl == move_angle
        self.send("move_#{move_angle.to_s}".to_sym)
        sleep 0.1
      end
      angle_shift(move_angle)
    end

    def lose
      super
      sleep 1
      gameover = Bomber::GameOver.new
      gameover.z = 10
      sleep 3
      exit
    end
  end
end