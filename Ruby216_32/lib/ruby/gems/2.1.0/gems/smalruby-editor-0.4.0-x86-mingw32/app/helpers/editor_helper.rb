# -*- coding: utf-8 -*-
module EditorHelper
  # ツールボックスのブロックに対して、キャラクターの入力フィールドの値を設定する
  #
  # @param [String] name 名前
  # @return [String] XML
  def toolbox_character_field(name = 'VAR')
    %(<field name="#{h name}">char1</field>).html_safe
  end

  # ツールボックスのブロックに対して、キーの入力フィールドの値を設定する
  #
  # @param [String] name 名前
  # @param [String] value キーの名前。K_SPACE、K_Aなど
  # @return [String] XML
  def toolbox_key_field(name = 'KEY', value = 'K_SPACE')
    %(<field name="#{h name}">#{h value}</field>).html_safe
  end

  # push or down field for Toolbox
  #
  # @param [String] name field name
  # @param [String] value :push or :down
  # @return [String] XML
  def toolbox_pod_field(name = 'POD', value = :down)
    if value == :down
      pod = 'down'
    else
      pod = 'push'
    end
    %(<field name="#{h name}">#{pod}</field>).html_safe
  end

  # ツールボックスのブロックに対して、PINの入力フィールドの値を設定する
  #
  # @param [String] value ピン
  # @param [String] name 名前
  # @return [String] XML
  def toolbox_pin_field(value, name = 'PIN')
    %(<field name="#{h name}">#{h value}</field>).html_safe
  end

  # ツールボックスのブロックに対して、数値型の入力のブロックを設定する
  #
  # @param [String] name 入力値の名前
  # @param [Numeric] value 数値
  # @return [String] XML
  def toolbox_number_value(name, value = 0)
    value = value.to_i unless value.is_a?(Numeric)
    <<-XML.strip_heredoc.html_safe
      <value name="#{h name}">
        <block type="math_number">
          <field name="NUM">#{h value}</field>
        </block>
      </value>
    XML
  end

  # ツールボックスのブロックに対して、テキスト型の入力のブロックを設定する
  #
  # @param [String] name 入力値の名前
  # @param [String] value 文字列
  # @return [String] XML
  def toolbox_text_value(name = 'TEXT', value = '')
    <<-XML.strip_heredoc.html_safe
      <value name="#{h name}">
        <block type="text">
          <field name="TEXT">#{h value}</field>
        </block>
      </value>
    XML
  end

  # I18n.t wrapper for Toolbox that's defualt scope is
  # 'editor.toolbox'.
  def toolbox_t(*args)
    if args.length == 1 && args.first[0] == '.'
      t(args.first[1..-1], scope: 'editor.toolbox')
    else
      t(*args)
    end
  end
  alias_method :tt, :toolbox_t
end
