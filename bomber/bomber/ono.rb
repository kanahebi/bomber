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
      if ($all_char - $blocks -[self]).empty?
        sleep 1
        gameclear = Bomber::GameClear.new
        gameclear.z = 10
        sleep 3
        exit
      end
    end

    def lose
      super
      sleep 1
      gameover = Bomber::GameOver.new
      gameover.z = 10
      sleep 10
      exit
    end
  end
end