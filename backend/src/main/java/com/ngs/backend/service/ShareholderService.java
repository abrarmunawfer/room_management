package com.ngs.backend.service;

import com.ngs.backend.entity.Shareholder;
import com.ngs.backend.repository.ShareholderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShareholderService {
    @Autowired
    private ShareholderRepository repository;

    public List<Shareholder> getAll() {
        return repository.findAll();
    }

    public Shareholder save(Shareholder shareholder) {
        return repository.save(shareholder);
    }

    public Shareholder update(Long id, Shareholder shareholderDetails) {
        Shareholder shareholder = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shareholder not found"));

        shareholder.setName(shareholderDetails.getName());
        shareholder.setType(shareholderDetails.getType());
        shareholder.setPercentage(shareholderDetails.getPercentage());

        return repository.save(shareholder);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
