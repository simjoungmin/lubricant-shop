package com.lubricantshop.back.domain.board.repository;

import com.lubricantshop.back.domain.board.BoardAnswer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardAnswerRepository extends JpaRepository<BoardAnswer, Long> {

    List<BoardAnswer> findByBoardBoardIdOrderByCreatedAtAsc(Long boardId);
}
